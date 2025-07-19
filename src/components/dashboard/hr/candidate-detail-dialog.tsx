
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Sparkles, Star } from 'lucide-react';
import type { Candidate, InterviewSummaryOutput } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface CandidateDetailDialogProps {
  candidate: Candidate;
  onUpdate: () => void;
}

export function CandidateDetailDialog({ candidate, onUpdate }: CandidateDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [notes, setNotes] = useState(candidate.notes || '');
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState<InterviewSummaryOutput | null>(null);
  const { toast } = useToast();

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/modules/hr/candidates/${candidate.id}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save notes.');
      }

      toast({
        title: 'Notes Saved!',
        description: `Notes for ${candidate.name} have been updated.`,
      });
      onUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Notes',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) {
        toast({ variant: 'destructive', title: 'Transcript is empty.' });
        return;
    }
    setIsSummarizing(true);
    setSummary(null);
    try {
        const response = await fetch('/api/modules/hr/interviews/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
            },
            body: JSON.stringify({ transcript }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to summarize transcript.');
        }

        const data: InterviewSummaryOutput = await response.json();
        setSummary(data);
        toast({ title: 'Summary Generated!', description: 'AI has summarized the interview transcript.' });

    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Summarization Error', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
        setIsSummarizing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{candidate.name}</DialogTitle>
          <DialogDescription>
            {candidate.email} &bull; Status: <Badge variant="outline">{candidate.status}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="py-4">
            <TabsList>
                <TabsTrigger value="details">AI Analysis</TabsTrigger>
                <TabsTrigger value="notes">Private Notes</TabsTrigger>
                <TabsTrigger value="summary">Interview Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
                <div className="text-sm space-y-3">
                    <p><strong>Match Score:</strong> {candidate.matchPercentage || 'N/A'}%</p>
                    <p><strong>Key Skills:</strong> {candidate.matchingSkills?.join(', ') || 'N/A'}</p>
                    <p className="text-muted-foreground">
                        <strong>AI Explanation:</strong> {candidate.matchExplanation || 'Not available.'}
                    </p>
                    <p>
                        <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            View Original Resume
                        </a>
                    </p>
                </div>
            </TabsContent>
            <TabsContent value="notes" className="pt-4">
                <div className="space-y-2">
                    <Label htmlFor="notes">Hiring Team's Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="Add your notes about this candidate here..."
                        className="min-h-[200px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                 <DialogFooter className="pt-4">
                    <Button type="button" onClick={handleSaveNotes} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isSaving ? 'Saving...' : 'Save Notes'}
                    </Button>
                </DialogFooter>
            </TabsContent>
            <TabsContent value="summary" className="pt-4 grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="transcript">Interview Transcript</Label>
                    <Textarea
                        id="transcript"
                        placeholder="Paste the full interview transcript here..."
                        className="min-h-[300px]"
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                    />
                     <Button onClick={handleSummarize} disabled={isSummarizing} className="w-full">
                        {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isSummarizing ? 'Summarizing...' : 'Generate AI Summary'}
                     </Button>
                </div>
                <div className="space-y-2">
                    <Label>AI-Generated Summary</Label>
                    <div className="border rounded-md p-4 min-h-[300px] bg-muted/50 text-sm space-y-4">
                        {isSummarizing ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                                <Skeleton className="h-4 w-1/4 mt-2" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-4/6" />
                            </div>
                        ) : summary ? (
                            <>
                                <div>
                                    <h4 className="font-semibold flex items-center">Recommendation: 
                                      <span className="ml-2 flex items-center gap-1 font-bold text-base">
                                        {summary.recommendationScore}/10 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                      </span>
                                    </h4>
                                    <p className="text-muted-foreground text-xs italic">"{summary.recommendationJustification}"</p>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold">Key Points</h4>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        {summary.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Strengths</h4>
                                    <ul className="list-disc list-inside text-muted-foreground">
                                        {summary.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Weaknesses</h4>
                                     <ul className="list-disc list-inside text-muted-foreground">
                                        {summary.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground py-10 text-center">Summary will appear here after generation.</p>
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
