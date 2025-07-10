import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plug, BrainCircuit, Rocket } from "lucide-react"

export function PlatformOverview() {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      title: "Real-time Decision Support",
      description: "Leverage Nerida Brain to analyze data streams and provide actionable insights instantly."
    },
    {
      icon: <Plug className="w-8 h-8 text-primary" />,
      title: "Integration-Ready APIs",
      description: "Seamlessly connect with your existing tools—CRMs, ERPs, and messaging platforms."
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Cross-Platform Automation",
      description: "Automate complex workflows across different applications and services with intelligent agents."
    }
  ]

  return (
    <section id="platform" className="pb-20 md:pb-28 bg-muted/50 dark:bg-muted/10">
      <div className="container max-w-7xl px-4">
        <div className="text-center max-w-3xl mx-auto relative z-10 mt-[-6rem] md:mt-[-8rem] bg-background/80 dark:bg-zinc-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border">
          <h2 className="text-3xl md:text-4xl font-bold">A Platform Built for Tomorrow</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Nerida AI provides the modular building blocks for creating powerful, business-aware AI agents.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 transition-transform transform hover:-translate-y-2">
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
