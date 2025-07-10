
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { PageHeader } from '@/components/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, BrainCircuit, Users } from 'lucide-react';
import Link from 'next/link';

const jobOpenings = [
  {
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote',
    description: 'Build the next generation of autonomous agents. Strong background in LLMs and system design required.',
  },
  {
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    location: 'Remote',
    description: 'Design intuitive and beautiful interfaces for our AI platform that users will love.',
  },
  {
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    description: 'Drive the growth of Nerida AI by developing and executing innovative marketing strategies.',
  },
];

const values = [
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Innovate Fearlessly",
        description: "We are pioneers, pushing the boundaries of what's possible with AI to build the future of work."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        title: "Think Deeply",
        description: "We tackle complex problems with intellectual rigor and a commitment to elegant, effective solutions."
    },
    {
        icon: <Users className="w-8 h-8 text-primary" />,
        title: "Win Together",
        description: "Our success is a collective effort. We collaborate with respect, transparency, and a shared mission."
    }
]

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <PageHeader 
          title="Join Our Mission"
          description="We're building the future of agentic AI to help businesses thrive. At Nerida AI, you'll work with a passionate team on problems that matter."
        />
        <section className="py-20 md:py-28">
            <div className="container max-w-7xl px-4">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        These are the principles that guide our work and our culture.
                    </p>
                </div>
                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    {values.map((value) => (
                        <div key={value.title} className="text-center">
                            <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-semibold">{value.title}</h3>
                            <p className="mt-2 text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <section id="openings" className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
          <div className="container max-w-5xl px-4">
             <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Current Openings</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Find your next opportunity and make an impact. We're looking for talented individuals to join our team.
                </p>
            </div>
            <div className="mt-12 space-y-8">
              {jobOpenings.map((job) => (
                <Card key={job.title} className="transition-all hover:shadow-lg">
                    <CardHeader className="grid md:grid-cols-3 items-start gap-4">
                        <div className="md:col-span-2">
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription className="mt-1">{job.department} &middot; {job.location}</CardDescription>
                        </div>
                         <div className="flex md:justify-end">
                            <Button asChild>
                                <Link href="mailto:neridaai@gmail.com?subject=Application for Senior AI Engineer">Apply Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">{job.description}</p>
                    </CardContent>
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
