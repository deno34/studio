
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactMarkdown from 'react-markdown';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UploadCloud, Loader2, Bot, PenSquare, FileText, User, Building, Smile, Frown, Meh, Search, Volume2 } from 'lucide-react';
import { ContractParserOutput, DocumentSummaryOutput, DocumentWriterInputSchema, type DocumentWriterInput } from '@/lib/types';
import { Badge } from '@/components/ui/badge';


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

function DocumentWriter() {
    const { toast } = useToast();
    const [isGenerating, setIsGenerating] = useState(false);
    const [draftContent, setDraftContent] = useState('');

    const form = useForm<DocumentWriterInput>({
        resolver: zodResolver(DocumentWriterInputSchema),
        defaultValues: {
            documentType: 'Email',
            purpose: '',
            audience: '',
            keywords: '',
            tone: 'Professional',
            length: 'Medium',
        },
    });

    const onSubmit = async (values: DocumentWriterInput) => {
        setIsGenerating(true);
        setDraftContent('');
        try {
            const response = await fetch('/api/modules/document/generate-draft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate draft.');
            }
            const result = await response.json();
            setDraftContent(result.draftContent);
            toast({ title: 'Draft Generated!', description: 'Your document has been drafted by the AI.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Generation Failed', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
        } finally {
            setIsGenerating(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Writer</CardTitle>
                <CardDescription>Generate drafts for emails, reports, and more.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="documentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Document Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Email">Email</SelectItem>
                                                <SelectItem value="Report">Report</SelectItem>
                                                <SelectItem value="Proposal">Proposal</SelectItem>
                                                <SelectItem value="Memo">Memo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="purpose"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purpose / Topic</FormLabel>
                                        <FormControl><Textarea placeholder="e.g., Summarize Q3 sales performance and outline Q4 goals." {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="audience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Audience</FormLabel>
                                        <FormControl><Input placeholder="e.g., Executive Leadership Team" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
                                {isGenerating ? 'Generating...' : 'Generate Draft'}
                            </Button>
                        </form>
                    </Form>
                     <div className="min-h-[200px]">
                        {isGenerating ? (
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-2/5" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/6" />
                                <Skeleton className="h-4 w-full mt-4" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        ) : draftContent ? (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold pt-2">Generated Draft</h3>
                                <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md min-h-[100px] bg-muted/50">
                                    <ReactMarkdown>{draftContent}</ReactMarkdown>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full min-h-[300px] items-center justify-center rounded-md border border-dashed">
                                <p className="text-sm text-muted-foreground text-center">Generated draft will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function SmartSearch() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Search</CardTitle>
        <CardDescription>Ask questions and get answers from all your uploaded documents.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center space-x-2">
            <Input type="text" placeholder="e.g., What is the termination clause in the Acme Inc contract?" />
            <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Ask
            </Button>
        </div>
        <div className="mt-4 min-h-[150px] rounded-md border border-dashed flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
                Answers from your documents will appear here. <br/>
                (Feature coming soon)
            </p>
        </div>
      </CardContent>
    </Card>
  )
}


function DocumentSummarizer() {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<DocumentSummaryOutput | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.type.startsWith('text/')) {
        toast({
          variant: 'destructive',
          title: 'Unsupported File Type',
          description: 'Please upload a PDF or text file.',
        });
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
      setSummary(null);
      setAudioUrl(null);
    }
  };

  const handleSummarize = async () => {
    if (!selectedFile) {
      toast({ variant: 'destructive', title: 'No file selected.' });
      return;
    }
    setIsSummarizing(true);
    setSummary(null);
    setAudioUrl(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/modules/document/summarize', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to summarize document.');
      }
      
      const result = await response.json();
      setSummary(result);
      toast({ title: 'Summary Complete!', description: 'Document summary has been generated.' });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!summary) return;
    setIsSpeaking(true);
    setAudioUrl(null);
    try {
      const textToSpeak = `
        Sentiment: ${summary.sentiment}. 
        Key Points: ${summary.summaryPoints.join('. ')}.
        Entities Mentioned: People: ${summary.entities.people.join(', ') || 'none'}. Companies: ${summary.entities.companies.join(', ') || 'none'}.
      `;

      const response = await fetch('/api/modules/document/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: JSON.stringify({ text: textToSpeak }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate audio.');
      }
      
      const result = await response.json();
      setAudioUrl(result.audioDataUri);

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSpeaking(false);
    }
  }
  
  React.useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  const sentimentIcon = {
    Positive: <Smile className="h-4 w-4 text-green-500" />,
    Negative: <Frown className="h-4 w-4 text-red-500" />,
    Neutral: <Meh className="h-4 w-4 text-yellow-500" />,
  }

  return (
    <Card>
        <CardHeader>
          <CardTitle>Document Summarizer</CardTitle>
          <CardDescription>Upload a document (PDF or TXT) to get an AI summary.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                 <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center">
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <p className="font-medium">{fileName || 'Drag & drop or click to upload'}</p>
                    <p className="text-sm text-muted-foreground">PDF or TXT</p>
                    <Button asChild variant="outline" size="sm" className="cursor-pointer">
                      <label htmlFor="summary-upload">Browse File</label>
                    </Button>
                    <Input id="summary-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.txt" />
                  </div>
                  <Button onClick={handleSummarize} disabled={isSummarizing || !selectedFile} className="w-full">
                    {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    {isSummarizing ? 'Analyzing...' : 'Analyze & Summarize'}
                  </Button>
            </div>
             <div className="min-h-[250px] space-y-4">
                  {isSummarizing ? (
                      <div className="space-y-4 pt-4">
                          <Skeleton className="h-6 w-1/4" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-6 w-1/3 mt-4" />
                          <Skeleton className="h-10 w-full" />
                      </div>
                  ) : summary ? (
                      <div className="space-y-4 text-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold flex items-center gap-2">Sentiment: 
                                <Badge variant="outline">{summary.sentiment} {sentimentIcon[summary.sentiment as keyof typeof sentimentIcon]} </Badge>
                            </h4>
                            <Button onClick={handleTextToSpeech} disabled={isSpeaking} size="sm" variant="outline">
                                {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Volume2 className="h-4 w-4 mr-2"/>}
                                Listen
                            </Button>
                            {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
                          </div>
                          <div>
                              <h4 className="font-semibold">Key Points</h4>
                              <ul className="list-disc list-inside text-muted-foreground">
                                  {summary.summaryPoints.map((p, i) => <li key={i}>{p}</li>)}
                              </ul>
                          </div>
                          <div>
                              <h4 className="font-semibold">Entities Mentioned</h4>
                               <div className="flex flex-wrap gap-2 mt-2">
                                {summary.entities.people.length > 0 && summary.entities.people.map((p,i) => <Badge variant="secondary" key={`p-${i}`}><User className="w-3 h-3 mr-1.5"/>{p}</Badge>)}
                                {summary.entities.companies.length > 0 && summary.entities.companies.map((c,i) => <Badge variant="secondary" key={`c-${i}`}><Building className="w-3 h-3 mr-1.5"/>{c}</Badge>)}
                               </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground rounded-md border border-dashed">
                          <p>Summary will appear here.</p>
                      </div>
                  )}
            </div>
        </CardContent>
    </Card>
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

          <div className="space-y-8">
            <SmartSearch />
            <Card>
                <CardHeader>
                  <CardTitle>Contract Parser</CardTitle>
                  <CardDescription>Upload a contract (PDF) to extract key details.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
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
                    </div>

                    <div className="min-h-[300px]">
                        <h3 className="font-semibold mb-2">Extracted Information</h3>
                        <div className="border rounded-md p-4 min-h-[inherit] bg-muted/50">
                        {isAnalyzing ? (
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-6 w-1/3 mt-4" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : analysisResult ? (
                            <AnalysisDisplay analysis={analysisResult} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                                <p>Upload a contract and click "Analyze" to see the results.</p>
                            </div>
                        )}
                        </div>
                    </div>
                </CardContent>
            </Card>
            <DocumentWriter />
            <DocumentSummarizer />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
