
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UploadCloud, Loader2, FileText, User, Percent, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { JobPosting, Candidate } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScheduleInterviewForm } from '@/components/dashboard/hr/schedule-interview-form';
import { GenerateFollowUpEmailForm } from '@/components/dashboard/hr/generate-follow-up-email-form';


function JobPageSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Candidates</CardTitle>
                    <CardDescription>Manage candidates who have applied for this job.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { toast } = useToast();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isRanking, setIsRanking] = useState<string | null>(null);


  const fetchJobAndCandidates = async () => {
      if (typeof jobId !== 'string') return;
      setIsLoading(true);
      try {
        // In a real app, you might fetch these in parallel
        // For simplicity, we'll fetch them sequentially
        const [jobRes, candidatesRes] = await Promise.all([
             fetch(`/api/modules/hr/jobs/${jobId}`, { 
                headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
             }),
             fetch(`/api/modules/hr/candidates?jobId=${jobId}`, { 
                headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
             })
        ]);
        
        if (!jobRes.ok) throw new Error('Failed to fetch job details');
        const jobData = await jobRes.json();
        setJob(jobData);

        if (!candidatesRes.ok) throw new Error('Failed to fetch candidates');
        const candidatesData = await candidatesRes.json();
        setCandidates(candidatesData.sort((a: Candidate, b: Candidate) => (b.matchPercentage || 0) - (a.matchPercentage || 0)));

      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch job data.' });
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchJobAndCandidates();
  }, [jobId, toast]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || typeof jobId !== 'string') return;
    
    setIsUploading(true);
    toast({ title: "Upload started...", description: `${files.length} resumes are being processed.` });

    try {
        const formData = new FormData();
        formData.append('jobId', jobId);
        for (const file of files) {
            formData.append('file', file);
        }

        const res = await fetch('/api/modules/hr/candidates', {
            method: 'POST',
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! },
            body: formData,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const result = await res.json();
        
        toast({ title: "Upload Successful!", description: "Resumes have been added." });
        
        // Now, rank the new candidate(s)
        setIsRanking(result.candidate.id); // Set ranking state for visual feedback
        toast({ title: "AI Ranking in Progress...", description: "Your new candidate is being analyzed." });

        const rankRes = await fetch('/api/modules/hr/candidates/rank', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! 
            },
            body: JSON.stringify({ jobId, resumeText: result.candidate.resumeText, candidateId: result.candidate.id }),
        });

        if (!rankRes.ok) {
            throw new Error('Ranking process failed');
        }
        
        toast({ title: "Ranking Complete!", description: "Candidate has been scored." });


    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'An error occurred', description: error instanceof Error ? error.message : "Could not process resumes." });
    } finally {
        setIsUploading(false);
        setIsRanking(null);
        fetchJobAndCandidates(); // Refresh data
    }
  };

  const onInterviewScheduled = () => {
    toast({
      title: 'Interview Scheduled!',
      description: "The interview has been successfully scheduled (mocked).",
    });
    // In a real app, you might want to refresh the candidate's status here
    fetchJobAndCandidates();
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container max-w-7xl px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard/agents/hr">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Postings
            </Link>
          </Button>

          {isLoading ? <JobPageSkeleton /> : !job ? (
            <Card className="text-center p-8">
                <CardTitle>Job Not Found</CardTitle>
                <CardDescription>The requested job posting could not be found.</CardDescription>
            </Card>
          ) : (
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{job.title}</CardTitle>
                        <CardDescription>{job.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-muted-foreground">{job.description}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Candidates</CardTitle>
                        <CardDescription>Upload and manage candidates for this job.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center">
                            <UploadCloud className="h-12 w-12 text-muted-foreground" />
                            <p className="font-medium">Drag & drop resumes here or click to upload</p>
                            <p className="text-sm text-muted-foreground">PDF only</p>
                             <Button asChild variant="outline" size="sm" className="relative">
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : 'Browse Files'}
                                </label>
                            </Button>
                            <Input id="resume-upload" type="file" multiple className="sr-only" onChange={handleFileUpload} disabled={isUploading}/>
                        </div>

                         <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead><User className="h-4 w-4 inline-block mr-1" /> Name</TableHead>
                                <TableHead><Percent className="h-4 w-4 inline-block mr-1" /> Match</TableHead>
                                <TableHead><Star className="h-4 w-4 inline-block mr-1" /> Key Skills</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidates.length > 0 ? candidates.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">
                                          {c.name}
                                          {(c.matchPercentage || 0) > 90 && <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Top Candidate</Badge>}
                                          {isRanking === c.id && <Badge variant="outline" className="ml-2"><Loader2 className="mr-1 h-3 w-3 animate-spin"/>Ranking...</Badge>}
                                        </TableCell>
                                        <TableCell>
                                          {c.matchPercentage !== undefined ? (
                                             <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <div className="flex items-center gap-1 cursor-help">
                                                    <span>{c.matchPercentage}%</span>
                                                    <div className="flex">
                                                      {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${(c.matchPercentage || 0) >= (i+1)*20 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                                      ))}
                                                    </div>
                                                  </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p className="max-w-xs">{c.matchExplanation}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          ) : (
                                            <span className="text-muted-foreground">Not ranked</span>
                                          )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground max-w-xs truncate">{c.matchingSkills?.join(', ') || 'N/A'}</TableCell>
                                        <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <GenerateFollowUpEmailForm candidate={c} job={job} />
                                            <ScheduleInterviewForm candidate={c} onInterviewScheduled={onInterviewScheduled}>
                                              <Button variant="outline" size="sm">Schedule</Button>
                                            </ScheduleInterviewForm>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            No candidates uploaded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
