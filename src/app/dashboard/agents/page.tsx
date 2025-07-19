
'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calculator, Users, Bot, ScanText, BarChart3, Settings } from 'lucide-react';

const agents = [
  {
    name: 'Accounting',
    description: 'Handles invoicing, expense tracking, and financial report generation.',
    icon: <Calculator className="w-8 h-8" />,
    status: 'Operational',
    href: '/dashboard/agents/accounting',
  },
  {
    name: 'Human Resources (HR)',
    description: 'Manages job postings, resume screening, and the candidate pipeline.',
    icon: <Users className="w-8 h-8" />,
    status: 'Operational',
    href: '/dashboard/agents/hr',
  },
  {
    name: 'Operations',
    description: 'Automates business workflows, logistics, and operational tasks.',
    icon: <Settings className="w-8 h-8" />,
    status: 'Coming Soon',
    href: '#',
  },
  {
    name: 'Document AI',
    description: 'Analyzes receipts, contracts, and other documents to extract key information.',
    icon: <ScanText className="w-8 h-8" />,
    status: 'Coming Soon',
    href: '#',
  },
  {
    name: 'Business Intelligence',
    description: 'Generates market analysis, trend reports, and business insights.',
    icon: <BarChart3 className="w-8 h-8" />,
    status: 'Coming Soon',
    href: '#',
  },
];

export default function AgentsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-5xl px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">My AI Agents</h1>
            <p className="text-muted-foreground">
              Manage and interact with your specialized AI workforce.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {agents.map((agent) => (
              <Card
                key={agent.name}
                className={`transition-all ${
                  agent.status === 'Operational' ? 'hover:shadow-lg hover:border-primary/50' : 'opacity-60'
                }`}
              >
                <Link href={agent.href} className={agent.status !== 'Operational' ? 'pointer-events-none' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          {agent.icon}
                        </div>
                        <div>
                          <CardTitle>{agent.name}</CardTitle>
                           <Badge variant={agent.status === 'Operational' ? 'default' : 'secondary'} className="mt-1">
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{agent.description}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
