
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Bot, UploadCloud, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type DashboardGeneratorOutput, type DashboardCard } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  file: z.instanceof(File, { message: 'Please upload a CSV file.' }),
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function DashboardBuilderTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardGeneratorOutput | null>(null);
  const [fileName, setFileName] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        prompt: '',
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Unsupported File Type',
          description: 'Please upload a CSV file.',
        });
        return;
      }
      form.setValue('file', file);
      setFileName(file.name);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setDashboardData(null);

    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('prompt', values.prompt);

    try {
      const response = await fetch('/api/modules/bi/generate-dashboard', {
        method: 'POST',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate dashboard.');
      }

      const result = await response.json();
      setDashboardData(result);
      toast({
        title: 'Dashboard Generated!',
        description: 'The AI has created your dashboard cards.',
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Dashboard',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Smart Dashboard Builder</CardTitle>
          <CardDescription>Upload a dataset and tell the AI what you want to see. It will generate the relevant KPI cards for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="file"
                        render={() => (
                            <FormItem>
                            <FormLabel>Dataset (CSV)</FormLabel>
                            <FormControl>
                                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-4 text-center h-full">
                                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm font-medium">{fileName || 'Click to upload CSV'}</p>
                                    <Button asChild variant="outline" size="sm" className="cursor-pointer">
                                        <label htmlFor="dashboard-file-upload">Browse</label>
                                    </Button>
                                    <Input id="dashboard-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>What do you want to see?</FormLabel>
                            <FormControl><Input placeholder="e.g., Show me a summary of total sales and user signups" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating Dashboard...' : 'Generate Dashboard'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Generated Dashboard</h3>
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
                <>
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </>
            ) : dashboardData && dashboardData.cards.length > 0 ? (
                dashboardData.cards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                             <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">{card.insight}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                 <div className="col-span-full flex h-48 w-full items-center justify-center text-sm text-muted-foreground rounded-md border border-dashed">
                    <p>Your AI-generated dashboard cards will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
