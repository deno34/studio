import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Rocket, PenTool, Bot, Building, Users } from "lucide-react"

export function UseCases() {
  const solutions = [
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "For Startups",
      description: "Scale faster with an AI that handles customer support, lead generation, and market research, letting you focus on product."
    },
    {
      icon: <PenTool className="w-8 h-8 text-primary" />,
      title: "For Agencies",
      description: "Automate client reporting, draft marketing copy, and manage project workflows to deliver results more efficiently."
    },
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: "For Tech Teams",
      description: "Integrate with your CI/CD pipeline, automate testing scripts, and generate documentation to speed up development cycles."
    },
    {
      icon: <Building className="w-8 h-8 text-primary" />,
      title: "For Retail",
      description: "Optimize inventory, personalize customer interactions, and manage your supply chain with an AI that understands your business."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "For Remote Workers",
      description: "Summarize meetings, organize tasks, and draft communications to stay productive and connected, wherever you are."
    }
  ]
  return (
    <section id="use-cases" className="py-20 md:py-28">
      <div className="container max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Solutions for Every Team</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Nerida AI is a flexible partner, adapting to the unique challenges and workflows of your industry.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution) => (
            <Card key={solution.title} className="bg-card/50 dark:bg-muted/20 border-border/50 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="p-6">
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                 {solution.icon}
                </div>
                <CardTitle>{solution.title}</CardTitle>
                <CardDescription className="mt-2">{solution.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
