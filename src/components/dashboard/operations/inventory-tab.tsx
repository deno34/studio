
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

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
                <p className="text-sm text-center text-muted-foreground py-8">
                    Restock suggestions from the AI will appear here based on sales velocity and stock levels.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
