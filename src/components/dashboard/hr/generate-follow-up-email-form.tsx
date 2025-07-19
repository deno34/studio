'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Send } from 'lucide-react';
import type { Candidate, JobPosting } from '@/lib/types';
import type { FollowUpEmailOutput } from '@/ai/flows/follow-up-email-flow';
import { Skeleton } from '@/components/ui/skeleton';

interface GenerateFollowUpEmailFormProps {
  candidate: Candidate;
  job: JobPosting;
}

export function GenerateFollowUpEmailForm({ candidate, job }: GenerateFollowUpEmailFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [tone, setTone] = useState<'Positive' | 'Negative' | 'Hold' | ''>('');
  const [emailContent, setEmailContent] = useState<FollowUpEmailOutput | null>(null);
  const { toast } = useToast();

  const handleGenerateEmail = async () => {
    if (!tone) {
      toast({ variant: 'destructive', title: 'Please select a tone.' });
      return;
    }
    setIsGenerating(true);
    setEmailContent(null);
    try {
      const response = await fetch('/api/modules/hr/emails/generate-followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
        },
        body: JSON.stringify({
          candidateName: candidate.name,
          jobTitle: job.title,
          tone,
          companyName: 'Nerida AI', // In a real app, this would come from settings
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate email.');
      }
      
      const data = await response.json();
      setEmailContent(data);

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Generation Error', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    // Mock sending the email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setIsOpen(false);
    setEmailContent(null);
    setTone('');
    toast({
      title: 'Email Sent (Mocked)',
      description: `A follow-up email has been sent to ${candidate.name}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Follow-up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Follow-Up Email</DialogTitle>
          <DialogDescription>
            Generate an AI-powered follow-up email for {candidate.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tone" className="text-right">Tone</Label>
                <Select onValueChange={(value) => setTone(value as any)} value={tone}>
                    <SelectTrigger id="tone" className="col-span-3">
                        <SelectValue placeholder="Select email tone..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Positive">Positive (Next Steps)</SelectItem>
                        <SelectItem value="Negative">Negative (Rejection)</SelectItem>
                        <SelectItem value="Hold">Hold (Update Pending)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleGenerateEmail} disabled={isGenerating || !tone} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                {isGenerating ? 'Generating...' : 'Generate Email'}
            </Button>

            {isGenerating && (
                <div className="p-4 border rounded-md mt-4 space-y-3">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            )}
            
            {emailContent && (
                <div className="p-4 border rounded-md mt-4 space-y-2">
                    <h4 className="font-semibold text-lg">Subject: {emailContent.subject}</h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        <ReactMarkdown>{emailContent.body}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSendEmail} disabled={isSending || !emailContent}>
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            {isSending ? 'Sending...' : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
