
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2, Bot, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type InventoryItem, type RestockSuggestion } from '@/lib/types';

// Mock data, to be replaced with data fetched from Firestore
const mockInventory = [
    { id: '1', name: 'Laptop Pro 15"', sku: 'LP15-BLK-256', stockLevel: 42, reorderLevel: 20, vendor: 'Apple Inc.', location: 'Warehouse A' },
    { id: '2', name: 'Wireless Mouse', sku: 'WM-GRY-01', stockLevel: 15, reorderLevel: 30, vendor: 'Logitech', location: 'Warehouse B' },
    { id: '3', name: 'Ergonomic Keyboard', sku: 'EK-BLK-US', stockLevel: 78, reorderLevel: 25, vendor: 'Microsoft', location: 'Warehouse A' },
    { id: '4', name: 'USB-C Hub', sku: 'HUB-7P-SLV', stockLevel: 120, reorderLevel: 50, vendor: 'Anker', location: 'Storefront' },
];

export function InventoryTab() {
  const [inventory, setInventory] = useState(mockInventory);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<RestockSuggestion[]>([]);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const response = await fetch('/api/modules/operations/inventory/suggest-restock', {
         headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
      });
      if (!response.ok) {
        throw new Error('Failed to get restock suggestions.');
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
       toast({
        title: "Analysis Complete",
        description: data.suggestions?.length > 0 
          ? `Found ${data.suggestions.length} restock suggestions.`
          : "All inventory levels look good!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Could not fetch suggestions."
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Inventory Status</CardTitle>
                    <CardDescription>Track and manage your product inventory levels.</CardDescription>
                </div>
                 <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Stock Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inventory.map(item => {
                            const isLowStock = item.stockLevel < item.reorderLevel;
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                                    <TableCell className={isLowStock ? "text-destructive font-bold" : ""}>{item.stockLevel}</TableCell>
                                    <TableCell>
                                        <Badge variant={isLowStock ? 'destructive' : 'default'}>
                                            {isLowStock ? 'Reorder' : 'In Stock'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.vendor}</TableCell>
                                    <TableCell>{item.location}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>AI Restock Suggestions</CardTitle>
                <CardDescription>AI-powered recommendations for inventory restocking.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleGetSuggestions} disabled={isSuggesting} className="w-full mb-4">
                  {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                  {isSuggesting ? 'Analyzing Inventory...' : 'Get AI Restock Suggestions'}
                </Button>

                <div className="space-y-4">
                  {isSuggesting && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
                  
                  {suggestions.length > 0 && (
                     <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                            <Lightbulb className="w-5 h-5 mt-1 text-primary"/>
                            <div>
                              <p className="font-semibold">{suggestion.itemName} (SKU: {suggestion.sku})</p>
                              <p className="text-sm">Suggestion: <span className="font-bold">Reorder {suggestion.quantityToReorder} units</span>.</p>
                              <p className="text-xs text-muted-foreground">{suggestion.justification}</p>
                            </div>
                          </div>
                        ))}
                     </div>
                  )}

                  {!isSuggesting && suggestions.length === 0 && (
                      <p className="text-sm text-center text-muted-foreground py-8">
                          Click the button above to generate restock suggestions from the AI.
                      </p>
                  )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
