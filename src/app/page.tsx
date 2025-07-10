import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { ProductFeatures } from '@/components/landing/product-features';
import { UseCases } from '@/components/landing/use-cases';
import { Testimonials } from '@/components/landing/testimonials';
import { EarlyAccess } from '@/components/landing/early-access';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProductFeatures />
        <UseCases />
        <Testimonials />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
