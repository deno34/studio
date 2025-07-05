import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-full w-full max-w-7xl"
        style={{
          background: 'radial-gradient(circle at top, hsla(var(--primary) / 0.1), transparent 40%)'
        }}
       />
      <div className="container max-w-7xl text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-black md:text-6xl lg:text-7xl tracking-tighter">
            Agentic AI for the <br className="hidden md:block" /> Future of Work
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Meet Nerida AI — ethical, modular, and intelligent automation for every industry.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#early-access">Request Early Access</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#platform">Explore Capabilities</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
