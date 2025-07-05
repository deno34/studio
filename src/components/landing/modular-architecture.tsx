import { Card } from "@/components/ui/card"
import { Cpu, Layers, Link2, Code } from "lucide-react"

function ArchitectureNode({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function ModularArchitecture() {
  return (
    <section className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
      <div className="container max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative p-8 rounded-xl aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 rounded-xl animate-pulse" style={{ animationDuration: '5s' }}></div>
              
              <Card className="z-10 bg-background/80 backdrop-blur-sm p-4 w-48 text-center shadow-lg">
                <Cpu className="w-8 h-8 mx-auto text-primary"/>
                <h3 className="font-bold mt-2">Nerida AI Core</h3>
                <p className="text-xs text-muted-foreground">Nerida Brain</p>
              </Card>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-1/2 bg-border"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-px h-1/2 bg-border"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-px w-1/2 bg-border"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-px w-1/2 bg-border"></div>

              <Card className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 p-3 z-10 bg-background shadow-md">
                <Layers className="w-6 h-6 text-primary" />
              </Card>
               <Card className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 p-3 z-10 bg-background shadow-md">
                <Code className="w-6 h-6 text-primary" />
              </Card>
               <Card className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-3 z-10 bg-background shadow-md">
                <Link2 className="w-6 h-6 text-primary" />
              </Card>
            </div>
          </div>
          <div className="md:pl-8">
            <h2 className="text-3xl md:text-4xl font-bold">Plug &amp; Play Modularity</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Build the exact AI solution you need. Our modular architecture lets you combine APIs, custom logic, and data connectors to create bespoke agents for any task.
            </p>
            <div className="mt-8 space-y-6">
              <ArchitectureNode
                icon={<Layers className="w-6 h-6 text-primary"/>}
                title="API Gateways"
                description="Expose agent capabilities through secure, scalable APIs."
              />
              <ArchitectureNode
                icon={<Link2 className="w-6 h-6 text-primary"/>}
                title="Data Connectors"
                description="Integrate with CRMs, ERPs, and databases to give agents context."
              />
              <ArchitectureNode
                icon={<Code className="w-6 h-6 text-primary"/>}
                title="Custom Logic Layers"
                description="Define unique business rules and workflows with our SDKs."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
