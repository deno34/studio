
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2, Loader2, Download } from "lucide-react";
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

  const handleExportPdf = async () => {
    if (!report) {
      toast({ variant: 'destructive', title: 'No report to export.' });
      return;
    }
    toast({ title: "Generating PDF..." });
    try {
       const response = await fetch('/api/modules/accounting/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || ''
        },
        body: JSON.stringify({ markdownContent: report }),
      });
       if (!response.ok) throw new Error('Failed to generate PDF');

       const blob = await response.blob();
       const url = window.URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = "financial_report.pdf";
       document.body.appendChild(a);
       a.click();
       a.remove();
       window.URL.revokeObjectURL(url);

    } catch(error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error exporting PDF' });
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Reports</CardTitle>
        <CardDescription>Generate AI-powered financial reports from your accounting data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
            <Button size="lg" variant="outline" className="h-auto py-4 flex-1" onClick={() => handleGenerateReport('pnl')} disabled={isLoading}>
                <div className="flex flex-col items-center gap-2">
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : <FileText className="w-8 h-8" />}
                    <span className="font-semibold">{isLoading ? "Generating..." : "Generate Profit & Loss"}</span>
                </div>
            </Button>
            <Button size="lg" variant="outline" className="h-auto py-4 flex-1" onClick={() => handleGenerateReport('balance_sheet')} disabled={true}>
                 <div className="flex flex-col items-center gap-2">
                    <BarChart2 className="w-8 h-8" />
                    <span className="font-semibold">Generate Balance Sheet</span>
                </div>
            </Button>
        </div>
         <div className="p-4 bg-muted/50 rounded-lg min-h-[200px] prose prose-sm dark:prose-invert max-w-none relative">
            <div className="flex items-center justify-between not-prose mb-2">
                <h4 className="font-semibold">Generated Report Preview</h4>
                <Button variant="outline" size="sm" onClick={handleExportPdf} disabled={!report || isLoading}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                </Button>
            </div>
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
