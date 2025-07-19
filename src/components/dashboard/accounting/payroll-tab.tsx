
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";
import { PayrollSummaryOutput } from "@/lib/types";


export function PayrollTab() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<PayrollSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setSummary(null); // Reset summary when new file is selected
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please choose a payslip file to analyze.",
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch('/api/modules/accounting/payroll', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY || '',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze the document.');
      }
      
      if (!result.isPayslip) {
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'The uploaded document does not appear to be a valid payslip.',
        });
        setSummary(null);
      } else {
        setSummary(result as PayrollSummaryOutput);
        toast({
            title: 'Analysis Complete',
            description: 'Successfully extracted payroll information.',
        });
      }
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Could not analyze the document.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Analysis</CardTitle>
          <CardDescription>Upload a payslip to have AI extract a summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center">
            <UploadCloud className="h-12 w-12 text-muted-foreground" />
            <p className="font-medium">
              {fileName ? `Selected: ${fileName}` : "Drag & drop or click to upload"}
            </p>
            <p className="text-sm text-muted-foreground">Supported formats: PDF, PNG, JPG</p>
             <Button asChild variant="outline" size="sm" className="cursor-pointer">
                <label htmlFor="payroll-upload">Browse File</label>
             </Button>
            <Input id="payroll-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg"/>
          </div>

          <Button onClick={handleAnalyze} disabled={isLoading || !selectedFile} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Analyzing..." : "Analyze Payslip"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Summary</CardTitle>
          <CardDescription>The results of the AI analysis will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>

          )}
          {summary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Employee:</div>
                <div>{summary.employeeName || "N/A"}</div>
                <div className="font-semibold">Pay Period:</div>
                <div>{summary.payPeriod || "N/A"}</div>
                <div className="font-semibold">Gross Pay:</div>
                <div>KES {summary.grossPay?.toFixed(2) || "0.00"}</div>
                <div className="font-semibold text-primary">Net Pay:</div>
                <div className="font-bold text-primary">KES {summary.netPay?.toFixed(2) || "0.00"}</div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Deductions</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary.deductions && summary.deductions.length > 0 ? (
                      summary.deductions.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">KES {item.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">No deductions found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
           {!isLoading && !summary && (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                <p>Upload a document and click "Analyze" to see the summary.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
