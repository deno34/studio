
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UploadCloud, Loader2, Bot } from 'lucide-react';
import { ContractParserOutput } from '@/lib/types';

function AnalysisDisplay({ analysis }: { analysis: ContractParserOutput }) {
    if (!analysis.isContract) {
        return <p className="text-destructive">The uploaded document does not appear to be a contract.</p>
    }
    return (
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold">Parties Involved</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                    {analysis.parties.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="font-semibold">Key Dates</h3>
                <p className="text-sm text-muted-foreground"><strong>Effective Date:</strong> {analysis.effectiveDate || 'Not specified'}</p>
                <p className="text-sm text-muted-foreground"><strong>Termination Date:</strong> {analysis.terminationDate || 'Not specified'}</p>
            </div>
             <div>
                <h3 className="font-semibold">Jurisdiction</h3>
                <p className="text-sm text-muted-foreground">{analysis.jurisdiction || 'Not specified'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Key Obligations</h3>
                {analysis.keyObligations.map((o, i) => (
                    <div key={i} className="mt-2 text-sm p-2 bg-muted/50 rounded-md">
                        <p className="font-medium">{o.party}</p>
                        <p className="text-muted-foreground italic">"{o.obligation}"</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DocumentAIPage() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ContractParserOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: 'Unsupported File Type',
          description: 'For now, only PDF files are supported for contract analysis.',
        });
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({ variant: 'destructive', title: 'No file selected.' });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/modules/document/parse-contract', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze contract.');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
      toast({ title: 'Analysis Complete!', description: 'Contract details have been extracted.' });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
            <h1 className="text-3xl font-bold">Document AI Agent</h1>
            <p className="text-muted-foreground">
              Your AI assistant for understanding and working with documents.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contract Parser</CardTitle>
                <CardDescription>Upload a contract (PDF) to extract key details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center">
                  <UploadCloud className="h-12 w-12 text-muted-foreground" />
                  <p className="font-medium">{fileName || 'Drag & drop or click to upload'}</p>
                   <p className="text-sm text-muted-foreground">PDF only</p>
                  <Button asChild variant="outline" size="sm" className="cursor-pointer">
                    <label htmlFor="contract-upload">Browse File</label>
                  </Button>
                  <Input id="contract-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                </div>
                <Button onClick={handleAnalyze} disabled={isAnalyzing || !selectedFile} className="w-full">
                  {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Contract'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Information</CardTitle>
                <CardDescription>The AI-parsed details from your document will appear here.</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[300px]">
                {isAnalyzing && (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/3 mt-4" />
                        <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </div>
                )}
                {analysisResult && (
                    <AnalysisDisplay analysis={analysisResult} />
                )}
                 {!isAnalyzing && !analysisResult && (
                    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                        <p>Upload a contract and click "Analyze" to see the results.</p>
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
