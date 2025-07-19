
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
import { PlusCircle, Loader2, UploadCloud, FilePlus2 } from "lucide-react";

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

interface AnalysisResult {
    vendor?: string;
    date?: string;
    total?: number;
    items?: {name: string, price: number}[];
    raw_text?: string;
}

export function ExpensesTab() {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);


  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      note: "",
      amount: 0,
      category: "",
    },
  });

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/modules/accounting/expenses', {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
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
            'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!
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
      form.reset({ note: "", amount: 0, category: "" });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setAnalysisResult(null);
    }
  };

  const handleAnalyzeReceipt = async () => {
    if (!selectedFile) {
        toast({ variant: "destructive", title: "No file selected." });
        return;
    }
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
        const response = await fetch('/api/modules/accounting/analyze', {
            method: 'POST',
            headers: { 
                'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze receipt.');
        }

        const data = await response.json();
        setAnalysisResult(data.analysis);
        toast({ title: "Analysis Complete", description: "AI has extracted information from your receipt." });

    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Analysis Failed", description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleAddAnalyzedExpense = () => {
    if (!analysisResult) return;
    
    const expenseData: ExpenseFormValues = {
        note: analysisResult.vendor || "Scanned Expense",
        amount: analysisResult.total || 0,
        category: "Other", // User can change this
    };

    form.reset(expenseData);
    toast({ title: "Form Populated", description: "Expense form has been filled with analyzed data. Please review and submit." });
  }

  return (
    <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Analyze Receipt</CardTitle>
                    <CardDescription>Upload a receipt (PDF) to auto-fill the expense form.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center">
                        <UploadCloud className="h-12 w-12 text-muted-foreground" />
                        <p className="font-medium">{fileName || "Drag & drop or click to upload"}</p>
                        <Button asChild variant="outline" size="sm" className="cursor-pointer">
                            <label htmlFor="receipt-upload">Browse File</label>
                        </Button>
                        <Input id="receipt-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt"/>
                    </div>
                    <Button onClick={handleAnalyzeReceipt} disabled={isAnalyzing || !selectedFile} className="w-full">
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isAnalyzing ? "Analyzing..." : "Analyze Receipt"}
                    </Button>
                    {analysisResult && (
                        <div className="mt-4 p-4 border rounded-md bg-muted/50 space-y-2 text-sm">
                            <h4 className="font-semibold">Analysis Result:</h4>
                            <p><strong>Vendor:</strong> {analysisResult.vendor || 'N/A'}</p>
                            <p><strong>Total:</strong> KES {analysisResult.total?.toFixed(2) || 'N/A'}</p>
                            <Button size="sm" className="w-full mt-2" onClick={handleAddAnalyzedExpense}>
                                <FilePlus2 className="w-4 h-4 mr-2" /> Add as Expense
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Log New Expense</CardTitle>
                    <CardDescription>Manually add a new expense or analyze a receipt.</CardDescription>
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
                                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Software">Software</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Food & Entertainment">Food & Entertainment</SelectItem>
                                        <SelectItem value="Utilities">Utilities</SelectItem>
                                        <SelectItem value="Transport">Transport</SelectItem>
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
                                <TableCell colSpan={4} className="text-center py-10">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
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
                                <TableCell colSpan={4} className="text-center h-24">No expenses found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
