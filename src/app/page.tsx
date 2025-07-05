import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { PlatformOverview } from '@/components/landing/platform-overview';
import { FindmeBrain } from '@/components/landing/findme-brain';
import { ModularArchitecture } from '@/components/landing/modular-architecture';
import { EthicalAI } from '@/components/landing/ethical-ai';
import { UseCases } from '@/components/landing/use-cases';
import { EarlyAccess } from '@/components/landing/early-access';
import { Footer } from '@/components/landing/footer';
import { DeveloperPortalPreview } from '@/components/landing/developer-portal-preview';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <PlatformOverview />
        <FindmeBrain />
        <ModularArchitecture />
        <EthicalAI />
        <UseCases />
        <DeveloperPortalPreview />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
