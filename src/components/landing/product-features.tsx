import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, BrainCircuit, Bot, Clock, Combine, Search } from "lucide-react"

export function ProductFeatures() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "Automates Repetitive Tasks",
      description: "From data entry to customer emails, Nerida handles the grunt work so your team can focus on high-impact projects."
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      title: "Writes Business Strategies",
      description: "Analyzes market data to draft reports, marketing plans, and strategic documents, giving you a powerful starting point."
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Understands Human Intent",
      description: "Goes beyond keywords to grasp the context and nuance of any request, ensuring accurate and relevant outcomes."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Works 24/7, Tirelessly",
      description: "Your AI employee never sleeps, providing round-the-clock productivity for your global operations and customers."
    },
    {
      icon: <Combine className="w-8 h-8 text-primary" />,
      title: "Integrates With Your Tools",
      description: "Connects seamlessly with your existing CRM, ERP, Slack, and other essential software to create unified workflows."
    },
     {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Proactive & Autonomous",
      description: "Not just a tool, but a team member. Nerida can initiate tasks, identify opportunities, and solve problems on its own."
    }
  ]

  return (
    <section id="features" className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
       <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)), hsla(var(--primary) / 0.05), hsl(var(--background)))'
        }}
       />
      <div className="container max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Everything you need, and more.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Nerida isn't just another AI tool. It's a comprehensive platform designed to function as an intelligent member of your team.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-background/80 backdrop-blur-sm p-2 transition-all duration-300 hover:shadow-primary/10 hover:shadow-xl">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                 {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
