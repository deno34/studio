
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, Check, Bot, Calculator, Users, Settings, ScanText, BarChart3, Loader2 } from 'lucide-react';
import { OnboardingStepper } from '@/components/dashboard/add-business/onboarding-stepper';
import { cn } from '@/lib/utils';

const availableAgents = [
  { id: 'accounting', name: 'Accounting', description: 'Invoicing, expenses, reports.', icon: <Calculator className="w-6 h-6" /> },
  { id: 'hr', name: 'Human Resources', description: 'Recruiting, candidates, interviews.', icon: <Users className="w-6 h-6" /> },
  { id: 'operations', name: 'Operations', description: 'Logistics, inventory, CRM, tasks.', icon: <Settings className="w-6 h-6" /> },
  { id: 'document', name: 'Document AI', description: 'Summarize, parse, and draft docs.', icon: <ScanText className="w-6 h-6" /> },
  { id: 'bi', name: 'Business Intelligence', description: 'Forecasting, insights, charts.', icon: <BarChart3 className="w-6 h-6" /> },
  { id: 'custom', name: 'Custom Agent', description: 'Build your own agent from scratch.', icon: <Bot className="w-6 h-6" />, disabled: true },
];

export default function AgentSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const { toast } = useToast();
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['accounting', 'hr', 'operations']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAgent = (agentId: string) => {
    setSelectedAgents(prev =>
      prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]
    );
  };

  const handleContinue = async () => {
     if (!businessId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Business ID is missing. Please go back and create a profile.' });
      return;
    }
    if (selectedAgents.length === 0) {
      toast({ variant: 'destructive', title: 'No agents selected', description: 'Please select at least one agent to continue.' });
      return;
    }

    setIsSubmitting(true);
    try {
        const response = await fetch(`/api/modules/business/${businessId}/agents`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
            },
            body: JSON.stringify({ agents: selectedAgents }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save selected agents.');
        }
        
        toast({ title: 'Agents Selected!', description: 'Next, you can upload some initial documents.' });
        router.push(`/dashboard/add-business/documents?businessId=${businessId}`);

    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Error saving agents',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-4xl px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/dashboard/add-business?businessId=${businessId || ''}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>

          <OnboardingStepper currentStep="agents" />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Select Your AI Agents</CardTitle>
              <p className="text-muted-foreground">Choose the specialized agents you need for this business. You can always change this later.</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableAgents.map(agent => (
                        <div
                            key={agent.id}
                            onClick={() => !agent.disabled && toggleAgent(agent.id)}
                            className={cn(
                                "relative rounded-lg border p-4 cursor-pointer transition-all",
                                selectedAgents.includes(agent.id) ? "border-primary ring-2 ring-primary" : "hover:border-primary/50",
                                agent.disabled ? "opacity-50 cursor-not-allowed" : ""
                            )}
                        >
                            {selectedAgents.includes(agent.id) && (
                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                                    <Check className="w-3 h-3"/>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="text-primary">{agent.icon}</div>
                                <h3 className="font-semibold">{agent.name}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">{agent.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-8">
                    <Button onClick={handleContinue} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
