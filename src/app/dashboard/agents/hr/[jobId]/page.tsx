
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
import type { JobPosting } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for candidates - this will be replaced with real data
const mockCandidates = [
  { id: '1', name: 'Alice Johnson', match: 92, skills: 'React, Node.js, TypeScript', status: 'Interviewing' },
  { id: '2', name: 'Bob Williams', match: 85, skills: 'Python, Django, AWS', status: 'Shortlisted' },
  { id: '3', name: 'Charlie Brown', match: 78, skills: 'Java, Spring, Kubernetes', status: 'New' },
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof jobId === 'string') {
      const fetchJobDetails = async () => {
        setIsLoading(true);
        try {
          // This API endpoint doesn't exist yet, we'll create it next.
          // For now, we just mock the loading state.
          // const response = await fetch(`/api/modules/hr/jobs/${jobId}`);
          // if (!response.ok) throw new Error('Failed to fetch job details');
          // const data = await response.json();
          
          // MOCK DATA for now
          await new Promise(resolve => setTimeout(resolve, 1000));
          setJob({
            id: jobId,
            title: 'Senior AI Engineer',
            location: 'Remote',
            description: 'We are looking for a talented Senior AI Engineer to join our innovative team. The ideal candidate will have extensive experience in designing, developing, and deploying machine learning models and AI-powered applications. You will work on cutting-edge projects that push the boundaries of what is possible with artificial intelligence. Responsibilities include leading AI projects, mentoring junior engineers, and collaborating with cross-functional teams to deliver high-quality solutions. A strong background in Python, TensorFlow or PyTorch, and cloud platforms like AWS or GCP is required.',
            status: 'Open',
            createdAt: new Date().toISOString(),
            userId: 'test-user',
          });

        } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch job details.' });
        } finally {
          setIsLoading(false);
        }
      };
      fetchJobDetails();
    }
  }, [jobId, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        // We will implement the upload logic in a future step.
        toast({ title: "Upload started...", description: `${files.length} resumes are being uploaded.` });
    }
  }

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
                            <p className="text-sm text-muted-foreground">PDF, DOC, DOCX</p>
                            <Button asChild variant="outline" size="sm" className="cursor-pointer">
                                <label htmlFor="resume-upload">Browse Files</label>
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
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockCandidates.length > 0 ? mockCandidates.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>{c.match}%</TableCell>
                                        <TableCell className="text-muted-foreground">{c.skills}</TableCell>
                                        <TableCell>{c.status}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">View Details</Button>
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
