import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, ScanText, Bot, Settings, Calculator, BrainCircuit } from "lucide-react"

export function ProductFeatures() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Intelligent HR Agent",
      description: "Automate your hiring pipeline, from parsing resumes and ranking candidates to generating interview summaries and follow-up emails."
    },
    {
      icon: <ScanText className="w-8 h-8 text-primary" />,
      title: "Document AI Agent",
      description: "Extract key data from contracts, summarize long reports, get audio summaries via TTS, and draft new documents with precision."
    },
    {
      icon: <Calculator className="w-8 h-8 text-primary" />,
      title: "Smart Accounting Agent",
      description: "Manage finances with AI-powered expense tracking, payroll analysis, invoice generation, and automated P&L statement creation."
    },
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: "Automated Operations Agent",
      description: "Streamline your business with an AI that manages logistics, suggests inventory restocks, prioritizes CRM follow-ups, and plans your day."
    },
    {
      icon: <BrainCircuit className="w-8 h-8 text-primary" />,
      title: "Centralized AI Brain",
      description: "At the core, Nerida Brain provides the context-aware reasoning and proactive intelligence that powers every agent on the platform."
    },
     {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "Modular and Extensible",
      description: "Built for developers with an API-first design, allowing you to create custom logic and integrate agents into any application."
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
