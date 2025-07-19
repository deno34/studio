
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, PlusCircle, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";

// Mock data, to be replaced with data fetched from Firestore
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
];

const statusVariant = {
    Paid: 'default',
    Pending: 'secondary',
    Overdue: 'destructive'
} as const;

const invoiceFormSchema = z.object({
    clientName: z.string().min(2, "Client name must be at least 2 characters."),
    items: z.array(z.object({
        name: z.string().min(1, "Item name cannot be empty."),
        amount: z.coerce.number().positive("Amount must be a positive number."),
    })).min(1, "At least one item is required."),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export function InvoicesTab() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
        clientName: "",
        items: [{ name: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  async function onSubmit(values: InvoiceFormValues) {
    setIsSubmitting(true);
    try {
        const response = await fetch('/api/modules/accounting/invoices', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || '' 
            },
            body: JSON.stringify(values),
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Failed to generate invoice.");
        }

        toast({
            title: "Invoice Generated!",
            description: "Your invoice has been created and saved.",
            action: (
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  View Invoice <ExternalLink className="w-4 h-4 ml-2"/>
                </Button>
              </a>
            ),
        });
        form.reset();
        setIsDialogOpen(false);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error generating invoice",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>Manage and create your customer invoices.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Generate New Invoice</DialogTitle>
              <DialogDescription>Fill in the details below to create a new invoice.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl><Input placeholder="e.g. Acme Inc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Invoice Items</FormLabel>
                  <div className="space-y-2 mt-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <FormField
                          control={form.control}
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Input placeholder="Service or product description" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name={`items.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                               <FormControl><Input type="number" placeholder="Amount" {...field} className="w-28" /></FormControl>
                               <FormMessage />
                            </FormItem>
                          )}
                      />
                       <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  </div>
                   <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ name: "", amount: 0 })}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
                
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                     {isSubmitting ? 'Generating...' : 'Generate & Save Invoice'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell><Badge variant={statusVariant[invoice.status as keyof typeof statusVariant] || 'outline'}>{invoice.status}</Badge></TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                 <TableCell className="text-right">
                    <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
