import { Button } from "@/components/ui/button"
import { Download, MessageCircle } from "lucide-react"
import Link from "next/link"

export function BrainsayPromo() {
  return (
    <section id="brainsay" className="border-t">
      <div className="container max-w-7xl px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
                <div className="p-8 rounded-full bg-primary/10">
                    <MessageCircle className="w-24 h-24 text-primary" />
                </div>
            </div>
            <div className="md:pr-8">
              <p className="text-primary font-semibold">Also from Nerida AI</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Introducing Brainsay</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                From the creators of Nerida AI comes Brainsay, a revolutionary messaging platform powered by the same intelligent Nerida Brain. Experience smarter conversations and seamless collaboration.
              </p>
               <Button size="lg" className="mt-8" asChild>
                  <Link href="#">
                    <Download className="mr-2 h-5 w-5" />
                    Download Brainsay
                  </Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  )
}
