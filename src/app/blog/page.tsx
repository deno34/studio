import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const blogPosts = [
  {
    title: 'The Future of Work is Agentic',
    date: 'October 26, 2023',
    description: 'How autonomous AI agents are set to redefine productivity and business operations.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'futuristic robot',
    featured: true,
  },
  {
    title: 'Building Ethical AI: Our Core Principles',
    date: 'October 20, 2023',
    description: 'A deep dive into the ethical framework that guides Nerida AI\'s development.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'glowing brain',
  },
  {
    title: 'Case Study: How We Automated Support for a SaaS Startup',
    date: 'October 15, 2023',
    description: 'A look at the real-world impact of implementing Nerida AI for customer support.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'customer support',
  },
    {
    title: 'Integrating Nerida AI with Your Existing Stack',
    date: 'October 10, 2023',
    description: 'A technical guide to connecting Nerida AI with your favorite tools.',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'api integration',
  },
];

const featuredPost = blogPosts.find(p => p.featured);
const otherPosts = blogPosts.filter(p => !p.featured);

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PageHeader 
          title="Insights from Nerida AI"
          description="Explore our thoughts on AI, automation, and the future of business."
        />
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            {featuredPost && (
               <Card className="grid md:grid-cols-2 overflow-hidden mb-12">
                  <div className="relative h-64 md:h-auto">
                    <Image src={featuredPost.image} alt={featuredPost.title} layout="fill" objectFit="cover" data-ai-hint={featuredPost.aiHint} />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground mb-2">{featuredPost.date}</p>
                    <h2 className="text-2xl font-bold mb-2">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-4">{featuredPost.description}</p>
                    <Button variant="link" className="p-0 justify-start h-auto" asChild>
                      <Link href="#">Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </div>
              </Card>
            )}
            
            <h3 className="text-3xl font-bold mb-8">More Articles</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((post) => (
                <Card key={post.title} className="flex flex-col overflow-hidden">
                    <div className="relative h-48">
                        <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" data-ai-hint={post.aiHint} />
                    </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm">{post.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="p-0" asChild>
                      <Link href="#">Read More <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
