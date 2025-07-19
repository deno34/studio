
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const invoices = [
  {
    invoice: "INV001",
    customer: "Stripe Inc.",
    status: "Paid",
    totalAmount: "KES 25,000.00",
    date: "2023-10-25",
  },
  {
    invoice: "INV002",
    customer: "Shopify",
    status: "Pending",
    totalAmount: "KES 15,000.00",
    date: "2023-10-28",
  },
  {
    invoice: "INV003",
    customer: "Vercel",
    status: "Paid",
    totalAmount: "KES 35,000.00",
    date: "2023-10-15",
  },
  {
    invoice: "INV004",
    customer: "Netlify",
    status: "Overdue",
    totalAmount: "KES 5,000.00",
    date: "2023-09-20",
  },
];

const statusVariant = {
    Paid: 'default',
    Pending: 'secondary',
    Overdue: 'destructive'
} as const;


export function InvoicesTab() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage and create your customer invoices.</CardDescription>
        </div>
        <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Generate Invoice
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[invoice.status as keyof typeof statusVariant] || 'outline'}>{invoice.status}</Badge>
                </TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                 <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                       <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
