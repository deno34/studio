import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { UseCases } from '@/components/landing/use-cases';
import { PageHeader } from '@/components/page-header';

export default function UseCasesPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PageHeader 
            title="Solutions for Every Team"
            description="Nerida AI is a flexible partner, adapting to the unique challenges and workflows of your industry and team structure."
        />
        <UseCases />
      </main>
      <Footer />
    </div>
  );
}
