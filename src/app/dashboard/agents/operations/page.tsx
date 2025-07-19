
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Loader2, Bot, Route, DollarSign, Clock, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LogisticsPlanInput, LogisticsPlanInputSchema, LogisticsPlanOutput } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function OperationsAgentPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<LogisticsPlanOutput | null>(null);

  const form = useForm<LogisticsPlanInput>({
    resolver: zodResolver(LogisticsPlanInputSchema),
    defaultValues: {
      origin: '',
      destination: '',
      goodsDescription: '',
      transportMode: 'Road',
      deliveryDeadline: '',
    },
  });

  async function onSubmit(values: LogisticsPlanInput) {
    setIsLoading(true);
    setPlan(null);
    try {
      const response = await fetch('/api/modules/operations/logistics/assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate logistics plan.');
      }

      const result = await response.json();
      setPlan(result);
      toast({
        title: 'Logistics Plan Generated!',
        description: 'The AI has created a suggested logistics plan.',
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container max-w-7xl px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Agents
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">Operations Agent</h1>
            <p className="text-muted-foreground">
              Your AI assistant for logistics, scheduling, and inventory.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Logistics Assistant</CardTitle>
                <CardDescription>Get an AI-generated plan for your shipment.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origin</FormLabel>
                            <FormControl><Input placeholder="e.g., Nairobi, Kenya" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination</FormLabel>
                            <FormControl><Input placeholder="e.g., Kampala, Uganda" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                      control={form.control}
                      name="goodsDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goods Description</FormLabel>
                          <FormControl><Textarea placeholder="e.g., 2 pallets of medical supplies" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="transportMode"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Transport Mode</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a mode" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Road">Road</SelectItem>
                                <SelectItem value="Air">Air</SelectItem>
                                <SelectItem value="Sea">Sea</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="deliveryDeadline"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Deadline</FormLabel>
                                <FormControl><Input type="date" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                      {isLoading ? 'Generating Plan...' : 'Generate Plan'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI-Suggested Plan</CardTitle>
                <CardDescription>The generated plan will appear below.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                ) : plan ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Route Summary</h4>
                      <p className="text-sm text-muted-foreground">{plan.summary}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Route className="w-5 h-5 mt-1 text-primary" />
                            <div>
                                <h5 className="font-semibold">Route</h5>
                                <p className="text-sm text-muted-foreground">{plan.recommendedRoute}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 mt-1 text-primary" />
                            <div>
                                <h5 className="font-semibold">Est. Cost</h5>
                                <p className="text-sm text-muted-foreground">{plan.estimatedCost}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 mt-1 text-primary" />
                            <div>
                                <h5 className="font-semibold">Est. Time</h5>
                                <p className="text-sm text-muted-foreground">{plan.estimatedTime}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Truck className="w-5 h-5 mt-1 text-primary" />
                            <div>
                                <h5 className="font-semibold">Vendor</h5>
                                <p className="text-sm text-muted-foreground">{plan.suggestedVendor}</p>
                            </div>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
                    <p>Fill out the form to generate a plan.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
