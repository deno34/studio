
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Loader2, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Client, ClientStatus, ClientSchema } from '@/lib/types';
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


// Mock data, to be replaced with data fetched from Firestore
const mockClients: Client[] = [
    { id: '1', name: 'Acme Inc.', email: 'contact@acme.com', company: 'Acme Inc.', status: 'Lead', createdAt: new Date().toISOString() },
    { id: '2', name: 'Stark Industries', email: 'tony@stark.com', company: 'Stark Industries', status: 'Contacted', createdAt: new Date().toISOString() },
    { id: '3', name: 'Wayne Enterprises', email: 'bruce@wayne.com', company: 'Wayne Enterprises', status: 'Proposal', createdAt: new Date().toISOString() },
    { id: '4', name: 'Ollivanders Wand Shop', email: 'sales@ollivanders.co.uk', company: 'Ollivanders', status: 'Closed (Won)', createdAt: new Date().toISOString() },
];


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
  const [clients, setClients] = useState(mockClients);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const onSubmit = async (values: FormValues) => {
    // This will be wired up to the backend API
    console.log(values);
    toast({ title: "Submitting...", description: "This is a placeholder." });
  };

  return (
    <div className="space-y-4 mt-4">
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
                        {clients.map(client => (
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
  );
}
