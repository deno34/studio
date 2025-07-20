
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
    
    // In a real implementation, you would send the query to a new AI flow.
    // This flow would need access to the user's data context.
    // For now, we'll just mock the response.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockResponse = `Based on the sales data, your best-selling products last month were the "Wireless Mouse" with 350 units sold and the "USB-C Hub" with 280 units sold. The "Laptop Pro 15"" also performed well, contributing the most to revenue at $105,000.`;
    
    setResponse(mockResponse);
    setIsLoading(false);
    toast({
      title: 'Answer Generated',
      description: 'The AI has responded to your query.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>Ask your AI Analyst</span>
        </CardTitle>
        <CardDescription>Use natural language to ask questions about your business data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="e.g., What were my best-selling products last month?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <Button onClick={handleAsk} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            <span className="ml-2">Ask AI</span>
          </Button>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg min-h-[100px] text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>The AI is thinking...</span>
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
