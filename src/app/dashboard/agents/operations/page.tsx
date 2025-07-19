
'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { LogisticsTab } from '@/components/dashboard/operations/logistics-tab';
import { SchedulingTab } from '@/components/dashboard/operations/scheduling-tab';

export default function OperationsAgentPage() {
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
            <h1 className="text-3xl font-bold">Operations Agent</h1>
            <p className="text-muted-foreground">
              Your AI assistant for logistics, scheduling, and inventory.
            </p>
          </div>

          <Tabs defaultValue="logistics" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logistics">Logistics</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            </TabsList>
            <TabsContent value="logistics">
              <LogisticsTab />
            </TabsContent>
            <TabsContent value="scheduling">
              <SchedulingTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
