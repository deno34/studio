
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
import { Loader2, Save } from 'lucide-react';
import type { Candidate } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CandidateDetailDialogProps {
  candidate: Candidate;
  onUpdate: () => void;
}

export function CandidateDetailDialog({ candidate, onUpdate }: CandidateDetailDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState(candidate.notes || '');
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
      onUpdate(); // Refresh the parent component's data
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{candidate.name}</DialogTitle>
          <DialogDescription>
            {candidate.email} &bull; Status: <Badge variant="outline">{candidate.status}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="text-sm">
                <p><strong>Match Score:</strong> {candidate.matchPercentage || 'N/A'}%</p>
                <p className="mt-1"><strong>Key Skills:</strong> {candidate.matchingSkills?.join(', ') || 'N/A'}</p>
                <p className="mt-2 text-muted-foreground">
                    <strong>AI Explanation:</strong> {candidate.matchExplanation || 'Not available.'}
                </p>
                <p className="mt-2">
                    <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        View Original Resume
                    </a>
                </p>
            </div>
            <Separator />
            <div className="space-y-2">
                <Label htmlFor="notes">Private Notes</Label>
                <Textarea
                id="notes"
                placeholder="Add your notes about this candidate here..."
                className="min-h-[150px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                />
            </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveNotes} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Notes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
