
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
    // This flow would query Firestore for tasks, inventory, etc.
    // For now, we'll just mock the response based on the query.
    await new Promise(resolve => setTimeout(resolve, 1500));

    let mockResponse = "I can answer questions about your operations data. Try asking 'Which inventory items are low on stock?' or 'What are the highest priority leads in the CRM?'";
    if (query.toLowerCase().includes('low on stock')) {
        mockResponse = `The "Wireless Mouse" (15 units) and "External Webcam" (8 units) are currently below their reorder levels. I can generate restock suggestions if you'd like.`;
    } else if (query.toLowerCase().includes('priority leads')) {
        mockResponse = `The highest priority leads to follow up with today are "Innovate Inc." (status: Proposal) and "Tech Solutions LLC" (status: Lead, created 8 days ago).`;
    }

    setResponse(mockResponse);
    setIsLoading(false);
    toast({
      title: 'Answer Generated',
      description: 'The Operations AI has responded to your query.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>Ask your Operations AI</span>
        </CardTitle>
        <CardDescription>Use natural language to ask questions about your operational data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            placeholder="e.g., Which inventory items are low on stock?" 
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
                <span>The AI is analyzing your operational data...</span>
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
