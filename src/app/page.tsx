import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { ProductFeatures } from '@/components/landing/product-features';
import { UseCases } from '@/components/landing/use-cases';
import { Testimonials } from '@/components/landing/testimonials';
import { EarlyAccess } from '@/components/landing/early-access';
import { Footer } from '@/components/landing/footer';
import { PlatformOverview } from '@/components/landing/platform-overview';
import { NeridaBrain } from '@/components/landing/findme-brain';
import { EthicalAI } from '@/components/landing/ethical-ai';
import { ModularArchitecture } from '@/components/landing/modular-architecture';
import { DeveloperPortalPreview } from '@/components/landing/developer-portal-preview';
import { BrainsayPromo } from '@/components/landing/brainsay-promo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <PlatformOverview />
        <ProductFeatures />
        <NeridaBrain />
        <UseCases />
        <EthicalAI />
        <Testimonials />
        <ModularArchitecture />
        <DeveloperPortalPreview />
        <BrainsayPromo />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
