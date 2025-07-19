
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export function ReportsTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handleGenerateReport = async (reportType: 'pnl' | 'balance_sheet') => {
    setIsLoading(true);
    setReport(null);
    
    // For now, only P&L is enabled
    if (reportType !== 'pnl') {
        toast({
            variant: "destructive",
            title: "Not Implemented",
            description: "Balance sheet generation is not yet available.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/modules/accounting/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || ''
        },
        body: JSON.stringify({ reportType }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate report.');
      }

      setReport(result.reportMarkdown);
      toast({
        title: "Report Generated",
        description: "Your Profit & Loss statement is ready.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Report",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Reports</CardTitle>
        <CardDescription>Generate AI-powered financial reports from your accounting data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
            <Button size="lg" variant="outline" className="h-auto py-4" onClick={() => handleGenerateReport('pnl')} disabled={isLoading}>
                <div className="flex flex-col items-center gap-2">
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileText className="w-8 h-8" />}
                    <span className="font-semibold">{isLoading ? "Generating..." : "Generate Profit & Loss"}</span>
                    <span className="text-xs text-muted-foreground">For a selected period</span>
                </div>
            </Button>
            <Button size="lg" variant="outline" className="h-auto py-4" onClick={() => handleGenerateReport('balance_sheet')} disabled={true}>
                 <div className="flex flex-col items-center gap-2">
                    <BarChart2 className="w-8 h-8" />
                    <span className="font-semibold">Generate Balance Sheet</span>
                    <span className="text-xs text-muted-foreground">As of a specific date</span>
                </div>
            </Button>
        </div>
         <div className="p-4 bg-muted/50 rounded-lg min-h-[200px] prose prose-sm dark:prose-invert max-w-none">
            <h4 className="font-semibold not-prose">Generated Report Preview</h4>
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <p>The AI is analyzing your financial data. Please wait...</p>
              </div>
            )}
            {report ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{report}</ReactMarkdown>
            ) : (
                !isLoading && <p className="text-sm text-muted-foreground">Your generated report will appear here.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
