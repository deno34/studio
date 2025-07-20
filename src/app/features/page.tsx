import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { ProductFeatures } from '@/components/landing/product-features';
import { PageHeader } from '@/components/page-header';
import { NeridaBrain } from '@/components/landing/findme-brain';
import { EarlyAccess } from '@/components/landing/early-access';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PageHeader 
            title="A Feature for Every Challenge"
            description="Discover the powerful capabilities of Nerida AI. Our platform is designed to be a comprehensive, intelligent member of your team."
        />
        <ProductFeatures />
        <NeridaBrain />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
