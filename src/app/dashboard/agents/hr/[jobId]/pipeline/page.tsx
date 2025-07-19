
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Candidate, type JobPosting, type CandidateStatusType } from '@/lib/types';
import { CandidateCard } from '@/components/dashboard/hr/candidate-card';

const pipelineStages: CandidateStatusType[] = ['New', 'Shortlisted', 'Interviewing', 'Offer', 'Hired', 'Rejected'];

type GroupedCandidates = {
    [key in CandidateStatusType]: Candidate[];
};

export default function PipelinePage() {
    const { jobId } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [job, setJob] = useState<JobPosting | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobAndCandidates = async () => {
        if (typeof jobId !== 'string') return;
        setIsLoading(true);
        try {
            const [jobRes, candidatesRes] = await Promise.all([
                fetch(`/api/modules/hr/jobs/${jobId}`, { headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! } }),
                fetch(`/api/modules/hr/candidates?jobId=${jobId}`, { headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! } })
            ]);

            if (!jobRes.ok) throw new Error('Failed to fetch job details');
            setJob(await jobRes.json());

            if (!candidatesRes.ok) throw new Error('Failed to fetch candidates');
            setCandidates(await candidatesRes.json());
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch job data.' });
            router.push('/dashboard/agents/hr');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobAndCandidates();
    }, [jobId]);

    const handleStatusChange = async (candidateId: string, newStatus: CandidateStatusType) => {
        try {
            const response = await fetch(`/api/modules/hr/candidates/${candidateId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update status.");
            }
            
            toast({
                title: 'Status Updated',
                description: `Candidate moved to "${newStatus}" stage.`,
            });
            
            // Optimistically update UI or refetch
            setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c));

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error Updating Status', description: error instanceof Error ? error.message : "An unknown error occurred." });
        }
    };
    
    const groupedCandidates = candidates.reduce((acc, candidate) => {
        const status = candidate.status;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(candidate);
        return acc;
    }, {} as GroupedCandidates);


    if (isLoading) {
        return (
            <div className="flex flex-col min-h-dvh">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-1 bg-muted/30 py-8 md:py-12">
                <div className="container max-w-full px-4 md:px-6">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href={`/dashboard/agents/hr/${jobId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Job Details
                        </Link>
                    </Button>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Talent Pipeline</h1>
                        <p className="text-muted-foreground">Manage the candidate workflow for: {job?.title}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
                        {pipelineStages.map(stage => (
                            <div key={stage} className="bg-background/50 rounded-lg p-2 h-full">
                                <CardHeader className="p-2 mb-2 border-b">
                                    <CardTitle className="text-base font-semibold flex items-center justify-between">
                                        <span>{stage}</span>
                                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            {groupedCandidates[stage]?.length || 0}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <div className="space-y-3 p-2">
                                    {(groupedCandidates[stage] || []).map(candidate => (
                                       <CandidateCard 
                                            key={candidate.id} 
                                            candidate={candidate}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))}
                                    {(!groupedCandidates[stage] || groupedCandidates[stage].length === 0) && (
                                        <div className="text-center text-xs text-muted-foreground py-4">
                                            No candidates in this stage.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
