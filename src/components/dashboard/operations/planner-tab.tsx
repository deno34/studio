
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Skeleton } from "@/components/ui/skeleton";

export function PlannerTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setPlan(null);
    
    try {
      const response = await fetch('/api/modules/operations/planner/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || ''
        },
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate plan.');
      }

      setPlan(result.planMarkdown);
      toast({
        title: "Daily Plan Generated!",
        description: "Your AI-powered schedule for the day is ready.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Plan",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>AI Daily Planner</CardTitle>
        <CardDescription>Generate an optimized schedule for your day based on your tasks and meetings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {isLoading ? 'Generating Plan...' : 'Generate Today\'s Plan'}
        </Button>
         <div className="p-4 bg-muted/50 rounded-lg min-h-[400px] prose prose-sm dark:prose-invert max-w-none">
            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/6" />
                     <Skeleton className="h-6 w-1/4 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            ) : plan ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{plan}</ReactMarkdown>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground text-center">Your generated daily plan will appear here. Click the button above to get started.</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
