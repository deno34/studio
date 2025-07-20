
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AskAI() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!query) {
      toast({
        variant: 'destructive',
        title: 'Please enter a question.',
      });
      return;
    }
    
    setIsLoading(true);
    setResponse('');
    
    // In a real implementation, this would call a new AI flow with RAG capabilities.
    // This flow would query Firestore for candidates and job postings.
    // For now, we'll just mock the response based on the query.
    await new Promise(resolve => setTimeout(resolve, 1500));

    let mockResponse = "I'm sorry, I can only answer specific questions for this demo. Try asking 'Who are the top 3 candidates for the Senior AI Engineer role?' or 'How many candidates are in the interview stage for the Product Designer job?'";
    if (query.toLowerCase().includes('top 3 candidates')) {
        mockResponse = `Based on their match scores, the top 3 candidates for the "Senior AI Engineer" role are:\n1. Elena Rodriguez (98% match)\n2. Ben Carter (95% match)\n3. Priya Sharma (92% match)\nWould you like me to draft follow-up emails for them?`;
    } else if (query.toLowerCase().includes('interview stage')) {
        mockResponse = `There are currently 4 candidates in the "Interviewing" stage for the "Product Designer (UI/UX)" role. Their interviews are scheduled for later this week.`;
    }

    setResponse(mockResponse);
    setIsLoading(false);
    toast({
      title: 'Answer Generated',
      description: 'The HR AI has responded to your query.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>Ask your HR AI</span>
        </CardTitle>
        <CardDescription>Use natural language to ask questions about candidates, jobs, and your hiring pipeline.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="e.g., Who are the top 3 candidates for the Senior AI Engineer role?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            <span className="ml-2">Ask AI</span>
          </Button>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] text-sm whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>The AI is searching records...</span>
            </div>
          ) : response ? (
            <p className="text-foreground">{response}</p>
          ) : (
             <p className="text-muted-foreground">Your answer will appear here. For this demo, data context is mocked.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
