import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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
    cta: 'Get Started'
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

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PageHeader 
          title="Find the Right Plan for Your Team"
          description="Start for free, then scale up as you grow. All plans include our core AI capabilities."
        />
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                     <Button className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                        {tier.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
