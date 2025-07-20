
'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { ForecastingTab } from '@/components/dashboard/bi/forecasting-tab';

export default function BIAgentPage() {
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
            <h1 className="text-3xl font-bold">Business Intelligence Agent</h1>
            <p className="text-muted-foreground">
              Your AI assistant for forecasting, data analysis, and market insights.
            </p>
          </div>

          <Tabs defaultValue="forecasting" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
              <TabsTrigger value="dashboard_gen" disabled>Dashboard Builder</TabsTrigger>
              <TabsTrigger value="kpi_summary" disabled>KPI Summary</TabsTrigger>
              <TabsTrigger value="visualize" disabled>Visualize</TabsTrigger>
              <TabsTrigger value="market_watch" disabled>Market Watch</TabsTrigger>
            </TabsList>
            <TabsContent value="forecasting">
              <ForecastingTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
