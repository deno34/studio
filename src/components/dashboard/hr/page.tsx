
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, PlusCircle, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateJobPostForm } from '@/components/dashboard/hr/create-job-post-form';
import type { JobPosting } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AskAI } from '@/components/dashboard/hr/ask-ai';

export default function HRAgentPage() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/modules/hr/jobs', {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch job postings.');
      }
      const data = await response.json();
      setJobPostings(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error fetching jobs',
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobCreated = () => {
    fetchJobs(); // Refresh the job list after a new job is created
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
            <h1 className="text-3xl font-bold">Human Resources Agent</h1>
            <p className="text-muted-foreground">
              Your AI assistant for recruiting, hiring, and talent management.
            </p>
          </div>

          <div className="space-y-8">
            <AskAI />
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Job Postings</CardTitle>
                  <CardDescription>Manage your open job positions.</CardDescription>
                </div>
                <CreateJobPostForm onJobCreated={handleJobCreated}>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Job Post
                  </Button>
                </CreateJobPostForm>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted Date</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ) : jobPostings.length > 0 ? (
                      jobPostings.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell><Badge variant={job.status === 'Open' ? 'default' : 'secondary'}>{job.status}</Badge></TableCell>
                          <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                           <TableCell className="text-right">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/agents/hr/${job.id}`}>View</Link>
                            </Button>
                           </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No job postings yet. Create one to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
