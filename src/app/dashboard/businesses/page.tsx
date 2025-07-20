
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Business } from '@/lib/types';
import { BusinessCard } from '@/components/dashboard/business-card';

function BusinessesPageSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BusinessCard.Skeleton />
            <BusinessCard.Skeleton />
            <BusinessCard.Skeleton />
        </div>
    )
}


export default function BusinessesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const response = await fetch('/api/modules/business/list', {
                    headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch businesses.');
                }
                const data = await response.json();
                setBusinesses(data);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Could not fetch your businesses.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinesses();
    }, [user, toast]);

    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-1 bg-muted/30 py-12">
                <div className="container max-w-7xl px-4">
                    <Button variant="ghost" asChild className="mb-6">
                        <Link href="/dashboard">
                        <Building className="mr-2 h-4 w-4" />
                        Back to Dashboard
                        </Link>
                    </Button>

                    <div className="flex justify-between items-center mb-8">
                        <div>
                        <h1 className="text-3xl font-bold">My Businesses</h1>
                        <p className="text-muted-foreground">
                            Select a business to manage or create a new one.
                        </p>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/add-business">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Business
                            </Link>
                        </Button>
                    </div>
                    
                    {isLoading ? (
                        <BusinessesPageSkeleton />
                    ) : businesses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {businesses.map(business => (
                                <BusinessCard key={business.id} business={business} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold">No businesses found.</h3>
                            <p className="text-muted-foreground mt-2">Get started by adding your first business profile.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/dashboard/add-business">Create a Business</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
