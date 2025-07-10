import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative pt-20 pb-12 md:pt-32 md:pb-20">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-full w-full max-w-7xl"
        style={{
          background: 'radial-gradient(circle at top, hsla(var(--primary) / 0.1), transparent 40%)'
        }}
       />
      <div className="container max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-black md:text-6xl lg:text-7xl tracking-tighter">
              Your AI Employee <br className="hidden md:block" /> for Smarter Business
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Nerida AI automates tasks, writes strategies, and acts as a dedicated digital team member to accelerate your growth.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="#features">Explore Features</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#early-access">Try Live Demo</Link>
              </Button>
          </div>
      </div>
       <div className="container max-w-7xl px-4 mt-16 md:mt-24">
            <div className="relative rounded-xl border bg-card shadow-2xl shadow-primary/10 p-2">
            <Image
                src="/icon.png"
                width={1200}
                height={600}
                alt="Nerida AI Platform Showcase"
                className="rounded-lg object-cover"
                data-ai-hint="futuristic platform"
            />
            </div>
        </div>
    </section>
  )
}
