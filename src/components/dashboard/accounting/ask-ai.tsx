
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
    
    // In a real implementation, this would call a new AI flow.
    // This flow would need access to the user's data context (e.g., via a RAG pipeline).
    // For now, we'll just mock the response based on the query.
    await new Promise(resolve => setTimeout(resolve, 1500));

    let mockResponse = "I'm sorry, I can only answer specific questions for this demo. Try asking 'What was the total marketing spend last month?'";
    if (query.toLowerCase().includes('marketing spend')) {
        mockResponse = "Based on the logged expenses, the total marketing spend last month was KES 6,000, which is exactly on budget.";
    }

    setResponse(mockResponse);
    setIsLoading(false);
    toast({
      title: 'Answer Generated',
      description: 'The AI accountant has responded to your query.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>Ask your AI Accountant</span>
        </CardTitle>
        <CardDescription>Use natural language to ask questions about your financial data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="e.g., What was the total marketing spend last month?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            <span className="ml-2">Ask AI</span>
          </Button>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[80px] text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>The AI is analyzing your records...</span>
            </div>
          ) : response ? (
            <p className="text-foreground">{response}</p>
          ) : (
             <p className="text-muted-foreground">Your answer will appear here. For this demo, financial data is mocked.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
