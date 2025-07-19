
'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';

export default function AccountingAgentPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-5xl px-4">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/dashboard/agents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Agents
                </Link>
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Accounting Agent</h1>
                <p className="text-muted-foreground">
                    Your AI assistant for finance and accounting tasks.
                </p>
            </div>

            <div className="text-center py-20 bg-background rounded-lg border border-dashed">
                <div className="p-4 rounded-full bg-primary/10 mb-4 inline-block">
                    <Construction className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Under Construction</h2>
                <p className="text-muted-foreground mt-2">
                    We're building the interface for the Accounting Agent.
                    <br />
                    The API endpoints are active, and the UI is coming soon!
                </p>
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
