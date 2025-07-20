
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Bot, UploadCloud, PieChart, BarChart, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type ChartGeneratorOutput } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DynamicChart } from './dynamic-chart';

const formSchema = z.object({
  file: z.instanceof(File, { message: 'Please upload a CSV or JSON file.' }),
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
  chartType: z.enum(['bar', 'line', 'pie']),
});

type FormValues = z.infer<typeof formSchema>;

export function VisualizeTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<ChartGeneratorOutput | null>(null);
  const [fileName, setFileName] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        prompt: '',
        chartType: 'bar',
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && file.type !== 'application/json') {
        toast({
          variant: 'destructive',
          title: 'Unsupported File Type',
          description: 'Please upload a CSV or JSON file.',
        });
        return;
      }
      form.setValue('file', file);
      setFileName(file.name);
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setChartData(null);

    const formData = new FormData();
    formData.append('file', values.file);
    formData.append('prompt', values.prompt);
    formData.append('chartType', values.chartType);

    try {
      const response = await fetch('/api/modules/bi/chart', {
        method: 'POST',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate chart.');
      }

      const result = await response.json();
      setChartData(result);
      toast({
        title: 'Chart Generated!',
        description: 'The AI has created your chart and analysis.',
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Chart',
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
          <CardTitle>Generate Visualization</CardTitle>
          <CardDescription>Upload data to get an AI-powered chart.</CardDescription>
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
                                <p className="text-sm font-medium">{fileName || 'Click to upload CSV/JSON'}</p>
                                <Button asChild variant="outline" size="sm" className="cursor-pointer">
                                    <label htmlFor="chart-file-upload">Browse</label>
                                </Button>
                                <Input id="chart-file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.json" />
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
                      <FormLabel>What do you want to visualize?</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Show total sales per product category" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="chartType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chart Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a chart type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="pie">Pie Chart</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating Chart...' : 'Generate Chart'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Generated Chart & Analysis</CardTitle>
          <CardDescription>The chart generated by the AI will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="h-[350px] w-full rounded-md border p-4 bg-muted/30">
                {isLoading ? (
                     <Skeleton className="h-full w-full" />
                ) : chartData ? (
                    <DynamicChart 
                        chartType={form.getValues('chartType')}
                        chartData={chartData.chartData}
                        chartConfig={chartData.chartConfig}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        <BarChart className="h-8 w-8 mr-2" />
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
                    ) : chartData ? (
                        <p>{chartData.analysis}</p>
                    ) : (
                        <p>Fill out the form to generate a chart and analysis.</p>
                    )}
                 </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
