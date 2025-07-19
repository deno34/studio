
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2, MoreHorizontal, Bot, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Client, ClientStatus, ClientSchema, type LeadFollowupSuggestion } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusVariant = {
    'Lead': 'default',
    'Contacted': 'secondary',
    'Proposal': 'outline',
    'Closed (Won)': 'default',
    'Closed (Lost)': 'destructive'
} as const;

const formSchema = ClientSchema.pick({
    name: true,
    email: true,
    company: true,
    status: true,
});

type FormValues = Zod.infer<typeof formSchema>;


export function CrmTab() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<LeadFollowupSuggestion[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      status: 'Lead',
    },
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/modules/crm/clients', {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
      });
      if (!response.ok) throw new Error('Failed to fetch clients.');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : 'Could not fetch clients.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);


  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/modules/crm/clients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create client.');
      }
      toast({ title: "Client Added!", description: "The new client has been saved." });
      form.reset();
      setIsDialogOpen(false);
      fetchClients();
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : 'Could not save client.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestions([]);
     try {
      const response = await fetch('/api/modules/crm/suggest-followup', {
         headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
      });
      if (!response.ok) {
        throw new Error('Failed to get followup suggestions.');
      }
      const data = await response.json();
      setSuggestions(data.suggestions || []);
       toast({
        title: "Briefing Complete",
        description: data.suggestions?.length > 0 
          ? `Found ${data.suggestions.length} leads to prioritize today.`
          : "No specific follow-ups suggested today."
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
  }

  return (
    <div className="space-y-4 mt-4">
        <div className="grid lg:grid-cols-3 gap-4 items-start">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Client Management</CardTitle>
                            <CardDescription>Track leads and manage client relationships.</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Client
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add New Client</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details for the new client or lead.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Client Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. john.doe@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField
                                        control={form.control}
                                        name="company"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Company</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Example Corp" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ClientStatus.options.map(status => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <DialogFooter>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {isSubmitting ? 'Saving...' : 'Add Client'}
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
                                    <TableHead>Client</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                     <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : clients.map(client => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{client.company}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[client.status] || 'outline'}>{client.status}</Badge>
                                        </TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>AI Daily Briefing</CardTitle>
                        <CardDescription>AI-powered suggestions for who to contact today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={handleGetSuggestions} disabled={isSuggesting} className="w-full mb-4">
                        {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        {isSuggesting ? 'Analyzing Leads...' : 'Get Suggestions'}
                        </Button>

                        <div className="space-y-4">
                        {isSuggesting && <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}
                        
                        {suggestions.length > 0 && (
                            <div className="space-y-3">
                                {suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                                    <Lightbulb className="w-5 h-5 mt-1 text-primary flex-shrink-0"/>
                                    <div>
                                    <p className="font-semibold">{suggestion.clientName}</p>
                                    <p className="text-xs text-muted-foreground italic">"{suggestion.justification}"</p>
                                    </div>
                                </div>
                                ))}
                            </div>
                        )}

                        {!isSuggesting && suggestions.length === 0 && (
                            <p className="text-sm text-center text-muted-foreground py-8">
                                Click the button above to get your daily briefing.
                            </p>
                        )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
