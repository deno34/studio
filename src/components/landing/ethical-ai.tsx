import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldOff, Search, UserCheck } from "lucide-react"

export function EthicalAI() {
  const principles = [
    {
      icon: <ShieldOff className="w-8 h-8 text-primary" />,
      title: "No Data Exploitation",
      description: "Your data is yours. We never use it for training models or any purpose other than executing your tasks."
    },
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: "Full Transparency",
      description: "Understand how our agents make decisions. We provide clear logs and explanations for all automated actions."
    },
    {
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      title: "User-First Design",
      description: "Our platform is built to empower your teams, not replace them. Humans are always in control."
    }
  ]
  return (
    <section id="ethics" className="py-20 md:py-28 relative">
       <div
        className="absolute inset-0 -z-10 h-full w-full"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)), hsla(var(--primary) / 0.05), hsl(var(--background)))'
        }}
       />
      <div className="container max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Built on a Foundation of Trust</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            We believe the future of AI must be ethical. Our principles guide every decision we make and every product we build.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {principles.map((principle) => (
            <Card key={principle.title} className="bg-background/80 backdrop-blur-sm">
              <CardHeader className="p-6">
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                 {principle.icon}
                </div>
                <CardTitle>{principle.title}</CardTitle>
                <CardDescription className="mt-2">{principle.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
