
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Bot, Telescope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisCategory, type CompetitorAnalysisOutput } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
  categories: z.array(AnalysisCategory).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const analysisCategories = AnalysisCategory.options;

export function MarketWatchTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CompetitorAnalysisOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      categories: ['Headlines', 'Key Features'],
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/modules/bi/competitor-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze competitor.');
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete!',
        description: `Successfully analyzed ${values.url}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
          <CardDescription>Enter a competitor's URL to extract key information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competitor URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.competitor.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Information to Extract</FormLabel>
                      <FormMessage />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {analysisCategories.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Telescope className="mr-2 h-4 w-4" />}
                {isLoading ? 'Analyzing...' : 'Analyze Competitor'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Report</CardTitle>
          <CardDescription>The AI's findings will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4 space-y-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">AI Summary</h4>
                <p className="text-sm text-muted-foreground italic">"{analysisResult.summary}"</p>
              </div>
              <div className="space-y-3">
                {analysisResult.extractedData.map((data) => (
                  <div key={data.category}>
                    <h4 className="font-semibold">{data.category}</h4>
                    {data.findings.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {data.findings.map((finding, index) => (
                          <li key={index}>{finding}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No information found for this category.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
              <p>Enter a URL and click "Analyze" to see the report.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
