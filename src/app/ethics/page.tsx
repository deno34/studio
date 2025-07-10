import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { EthicalAI } from '@/components/landing/ethical-ai';
import { PageHeader } from '@/components/page-header';

export default function EthicsPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
         <PageHeader 
            title="Our Ethical Commitment"
            description="We believe the future of AI must be built on a foundation of trust, transparency, and respect for users. Our principles guide every decision we make."
        />
        <EthicalAI />
      </main>
      <Footer />
    </div>
  );
}
