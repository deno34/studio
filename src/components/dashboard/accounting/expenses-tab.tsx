
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

const recentExpenses = [
    { date: "2023-11-01", description: "Monthly SaaS Subscription", category: "Software", amount: "KES 1,500.00" },
    { date: "2023-11-01", description: "Team Lunch", category: "Food", amount: "KES 4,200.00" },
    { date: "2023-10-30", description: "Flight to NBO", category: "Travel", amount: "KES 22,000.00" },
    { date: "2023-10-29", description: "Facebook Ads", category: "Marketing", amount: "KES 10,000.00" },
];

export function ExpensesTab() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Expenses</CardTitle>
                    <CardDescription>A list of your most recent business expenses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentExpenses.map((expense, index) => (
                                <TableRow key={index}>
                                    <TableCell>{expense.date}</TableCell>
                                    <TableCell className="font-medium">{expense.description}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell className="text-right">{expense.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Log New Expense</CardTitle>
                    <CardDescription>Quickly add a new expense.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="e.g. Client Dinner" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amount">Amount (KES)</Label>
                        <Input id="amount" type="number" placeholder="e.g. 5000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="software">Software</SelectItem>
                                <SelectItem value="travel">Travel</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                         <p className="text-xs text-muted-foreground pt-1">AI will attempt to auto-categorize this for you.</p>
                    </div>
                    <Button className="w-full">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Log Expense
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
