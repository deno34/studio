import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { LifeBuoy, Truck, HeartPulse, ShoppingCart } from "lucide-react"

export function UseCases() {
  const industries = [
    {
      value: "support",
      label: "Customer Support",
      icon: <LifeBuoy className="w-5 h-5 mr-2" />,
      problem: "High ticket volumes and slow resolution times.",
      solution: "Nerida agents triage tickets, answer common questions, and route complex issues to the right human agent, 24/7.",
      useCase: "Automated Ticket Routing & Tier-1 Support"
    },
    {
      value: "logistics",
      label: "Logistics",
      icon: <Truck className="w-5 h-5 mr-2" />,
      problem: "Inefficient routing and supply chain disruptions.",
      solution: "AI agents monitor shipments in real-time, predict delays, and automatically optimize routes to save time and fuel.",
      useCase: "Real-time Order Optimization & Disruption Alerts"
    },
    {
      value: "healthcare",
      label: "Healthcare",
      icon: <HeartPulse className="w-5 h-5 mr-2" />,
      problem: "Administrative overhead and appointment scheduling chaos.",
      solution: "HIPAA-compliant agents manage patient appointments, send reminders, and handle billing inquiries securely.",
      useCase: "Smart Appointment Scheduling & Patient Communication"
    },
    {
      value: "retail",
      label: "Retail",
      icon: <ShoppingCart className="w-5 h-5 mr-2" />,
      problem: "Managing inventory and personalizing customer experiences.",
      solution: "Agents track stock levels, automate reordering, and provide personalized product recommendations to customers.",
      useCase: "Inventory Management & Personalized Shopping Assistants"
    }
  ]

  return (
    <section id="use-cases" className="py-20 md:py-28">
      <div className="container max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Transforming Every Industry</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            From startups to enterprise giants, Nerida AI provides intelligent automation solutions tailored to your unique challenges.
          </p>
        </div>
        <div className="mt-12">
          <Tabs defaultValue="support" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              {industries.map((industry) => (
                <TabsTrigger key={industry.value} value={industry.value} className="py-2.5 flex items-center justify-center text-center">
                  {industry.icon}
                  {industry.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {industries.map((industry) => (
              <TabsContent key={industry.value} value={industry.value}>
                <Card className="mt-6">
                  <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold">{industry.label}</h3>
                      <p className="mt-2 text-muted-foreground"><span className="font-semibold text-foreground">The Problem:</span> {industry.problem}</p>
                      <p className="mt-4 text-muted-foreground"><span className="font-semibold text-foreground">The Nerida Solution:</span> {industry.solution}</p>
                    </div>
                    <div className="bg-muted p-6 rounded-lg">
                      <h4 className="font-semibold">Example Use Case</h4>
                      <p className="mt-2 text-primary font-medium">{industry.useCase}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}
