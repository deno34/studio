
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Bot, Lightbulb, TrendingUp, AlertTriangleIcon, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type KpiSummaryOutput } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for demonstration
const kpiOptions = {
    'Monthly Recurring Revenue': [12000, 12500, 13200, 14000, 15100, 16000],
    'Customer Churn Rate': [4.5, 4.3, 4.4, 4.2, 4.1, 3.9],
    'New User Signups': [500, 520, 510, 480, 470, 450],
    'Website Bounce Rate': [65, 62, 63, 64, 66, 68],
};

const statusIcons = {
    Improving: <TrendingUp className="h-8 w-8 text-green-500" />,
    Warning: <AlertTriangleIcon className="h-8 w-8 text-yellow-500" />,
    Stable: <Minus className="h-8 w-8 text-gray-500" />,
};

export function KpiSummaryTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<KpiSummaryOutput | null>(null);
  const [selectedKpi, setSelectedKpi] = useState<string>('');
  
  const handleAnalyze = async () => {
    if (!selectedKpi) {
        toast({ variant: 'destructive', title: 'Please select a KPI to analyze.' });
        return;
    }
    
    setIsLoading(true);
    setSummary(null);

    try {
      const response = await fetch('/api/modules/bi/kpi-summary', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! 
        },
        body: JSON.stringify({
            kpiName: selectedKpi,
            kpiData: kpiOptions[selectedKpi as keyof typeof kpiOptions]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate KPI summary.');
      }

      const result = await response.json();
      setSummary(result);
      toast({
        title: 'Analysis Complete!',
        description: `The AI has generated a summary for ${selectedKpi}.`,
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Summary',
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
          <CardTitle>AI KPI Summary</CardTitle>
          <CardDescription>Select a Key Performance Indicator and let the AI provide an instant analysis and recommendation.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
                 <Select onValueChange={setSelectedKpi} value={selectedKpi}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a KPI to analyze..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(kpiOptions).map(kpi => (
                            <SelectItem key={kpi} value={kpi}>{kpi}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleAnalyze} disabled={isLoading || !selectedKpi} className="w-full sm:w-auto">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Analyzing...' : 'Get AI Summary'}
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>The AI-generated insights will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[250px]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : summary ? (
                <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
                    <div className="p-4 bg-muted rounded-full">
                        {statusIcons[summary.status as keyof typeof statusIcons]}
                    </div>
                    <div className="space-y-3">
                        <div>
                            <h4 className="font-semibold">Trend Summary</h4>
                            <p className="text-muted-foreground text-sm">{summary.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Likely Cause</h4>
                            <p className="text-muted-foreground text-sm">{summary.cause}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold flex items-center gap-2"><Lightbulb className="w-4 h-4 text-primary" />AI Recommendation</h4>
                            <p className="text-muted-foreground text-sm pl-6">{summary.action}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-full min-h-[200px] w-full items-center justify-center text-sm text-muted-foreground rounded-md border border-dashed">
                    <p>Select a KPI and click "Get AI Summary" to see the analysis.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
