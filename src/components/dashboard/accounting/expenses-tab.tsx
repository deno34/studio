
'use client';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Loader2 } from "lucide-react";

const expenseFormSchema = z.object({
  note: z.string().min(2, { message: "Description must be at least 2 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  category: z.string().nonempty({ message: "Please select a category." }),
  date: z.string().optional(), // Will be set on the server
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface Expense {
    id: string;
    amount: number;
    category: string;
    date: string;
    note: string;
    createdAt: string;
}

export function ExpensesTab() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      note: "",
      amount: 0,
      category: "",
    },
  });

  const fetchExpenses = async () => {
    try {
      // NOTE: For this demo, we assume a master API key is set in environment variables.
      // In a real app, you would manage user-specific API keys.
      const response = await fetch('/api/modules/accounting/expenses', {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || '' }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch expenses.');
      }
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error fetching expenses",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function onSubmit(values: ExpenseFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/modules/accounting/expenses', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || '' 
        },
        body: JSON.stringify({
            ...values,
            date: new Date().toISOString().split('T')[0], // Set current date
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log expense.');
      }

      toast({
        title: "Expense Logged!",
        description: "Your expense has been successfully recorded.",
      });
      form.reset();
      fetchExpenses(); // Refresh the list of expenses

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error logging expense",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

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
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : expenses.length > 0 ? (
                                expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">{expense.note}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell className="text-right">KES {expense.amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No expenses found.</TableCell>
                                </TableRow>
                            )}
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
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Client Dinner" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount (KES)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g. 5000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Software">Software</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Food">Food</SelectItem>
                                        <SelectItem value="Utilities">Utilities</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                                {isSubmitting ? 'Logging...' : 'Log Expense'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    