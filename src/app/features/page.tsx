import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { ProductFeatures } from '@/components/landing/product-features';
import { PageHeader } from '@/components/page-header';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PageHeader 
            title="Features"
            description="Discover the powerful capabilities of Nerida AI. Our platform is designed to be a comprehensive, intelligent member of your team."
        />
        <ProductFeatures />
      </main>
      <Footer />
    </div>
  );
}
