
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const taxRecords = [
    { type: "VAT", dueDate: "2023-11-20", amount: "KES 45,000", status: "Filed" },
    { type: "PAYE", dueDate: "2023-11-09", amount: "KES 80,000", status: "Filed" },
    { type: "Corporate Tax", dueDate: "2024-06-30", amount: "Est. KES 500,000", status: "Pending" },
    { type: "Withholding Tax", dueDate: "2023-11-20", amount: "KES 12,500", status: "Filed" },
    { type: "Rental Income Tax", dueDate: "2023-11-20", amount: "KES 8,000", status: "Filed" },
];

const statusVariant = {
    Filed: 'default',
    Pending: 'secondary',
    Overdue: 'destructive'
} as const;

export function TaxesTab() {
  return (
    <Card>
       <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Tax Logging</CardTitle>
                <CardDescription>Manage and track your tax records and due dates.</CardDescription>
            </div>
            <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Log Tax Document
            </Button>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Tax Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {taxRecords.map(record => (
                    <TableRow key={record.type}>
                        <TableCell className="font-medium">{record.type}</TableCell>
                        <TableCell>{record.dueDate}</TableCell>
                        <TableCell>{record.amount}</TableCell>
                        <TableCell>
                             <Badge variant={statusVariant[record.status as keyof typeof statusVariant] || 'outline'}>
                                {record.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
         <p className="text-xs text-muted-foreground mt-4">Upload a tax document and the AI will attempt to extract this information automatically.</p>
      </CardContent>
    </Card>
  );
}
