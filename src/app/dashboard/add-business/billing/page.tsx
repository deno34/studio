
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, PartyPopper } from 'lucide-react';
import { OnboardingStepper } from '@/components/dashboard/add-business/onboarding-stepper';

const tiers = [
  {
    name: 'Starter',
    price: '$49',
    frequency: '/month',
    description: 'For individuals and small teams getting started with AI.',
    features: [
      '1 AI Agent',
      'Basic Task Automation',
      'Email & Chat Support',
      'Standard Integrations'
    ],
    cta: 'Choose Starter'
  },
  {
    name: 'Pro',
    price: '$199',
    frequency: '/month',
    description: 'For growing businesses that need more power and customization.',
    features: [
      '5 AI Agents',
      'Advanced Task Automation',
      'Priority Support',
      'Custom Integrations',
      'API Access'
    ],
    cta: 'Choose Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    frequency: '',
    description: 'For large organizations with specific security and support needs.',
    features: [
      'Unlimited AI Agents',
      'Dedicated Infrastructure',
      '24/7 Premium Support',
      'On-premise Deployment',
      'Custom SLAs'
    ],
    cta: 'Contact Sales'
  }
];


export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');

  const handleFinish = () => {
    // Here you would process payment, provision resources, etc.
    // For now, just navigate to the dashboard.
    console.log('Finalizing setup for businessId:', businessId);
    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-4xl px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/dashboard/add-business/documents?businessId=${businessId || ''}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documents
            </Link>
          </Button>

          <OnboardingStepper currentStep="billing" />

          <section className="py-8">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Choose Your Plan</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    You're almost there! Select a plan to activate your new business workspace.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col ${tier.popular ? 'border-primary shadow-2xl shadow-primary/10' : ''}`}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                     <div className="flex items-baseline gap-1 pt-4">
                        <span className="text-4xl font-bold">{tier.price}</span>
                        <span className="text-muted-foreground">{tier.frequency}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                     <Button className="w-full" variant={tier.popular ? 'default' : 'outline'} onClick={handleFinish}>
                        {tier.popular && <PartyPopper className="w-4 h-4 mr-2" />}
                        {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
