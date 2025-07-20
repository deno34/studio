
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Bot, UploadCloud, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type ForecastingOutput, type ForecastPoint } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from 'recharts';

const formSchema = z.object({
  file: z.instanceof(File, { message: 'Please upload a CSV file.' }),
  metric: z.string().min(1, { message: 'Metric name is required.' }),
  period: z.coerce.number().int().min(1, 'Forecast period must be at least 1.').max(24, 'Cannot forecast more than 24 periods.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ForecastingTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastingOutput | null>(null);
  const [fileName, setFileName] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        metric: '',
        period: 3,
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
    setForecastData(null);

    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('metric', values.metric);
    formData.append('period', values.period.toString());

    try {
      const response = await fetch('/api/modules/bi/forecast', {
        method: 'POST',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate forecast.');
      }

      const result = await response.json();
      setForecastData(result);
      toast({
        title: 'Forecast Generated!',
        description: 'The AI has created your forecast and analysis.',
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Forecast',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3 mt-4">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Generate Forecast</CardTitle>
          <CardDescription>Upload data to get an AI-powered forecast.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                        <FormItem>
                        <FormLabel>Dataset</FormLabel>
                        <FormControl>
                            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-4 text-center">
                                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm font-medium">{fileName || 'Click to upload CSV'}</p>
                                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                                    <label htmlFor="file-upload">Browse</label>
                                </Button>
                                <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="metric"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metric to Forecast</FormLabel>
                      <FormControl><Input placeholder="e.g., revenue, orders" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forecast Period (e.g., months)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 3" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating Forecast...' : 'Generate Forecast'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Forecast Visualization & Analysis</CardTitle>
          <CardDescription>The generated forecast will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="h-[300px] w-full rounded-md border p-4 bg-muted/30">
                {isLoading ? (
                     <Skeleton className="h-full w-full" />
                ) : forecastData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={forecastData.forecast}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : ''} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" name="Historical" dot={false} />
                            <Line type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" name="Forecast" strokeDasharray="5 5" dot={{ r: 4 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        <LineChart className="h-8 w-8 mr-2" />
                        Your chart will appear here.
                    </div>
                )}
            </div>
            <div>
                 <h4 className="font-semibold mb-2">AI Analysis</h4>
                 <div className="p-4 rounded-md bg-muted/30 min-h-[100px] text-sm text-muted-foreground">
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ) : forecastData ? (
                        <p>{forecastData.analysis}</p>
                    ) : (
                        <p>Fill out the form to generate a forecast and analysis.</p>
                    )}
                 </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
