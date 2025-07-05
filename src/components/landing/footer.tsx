import Link from "next/link"
import { Bot, Twitter, Github, Linkedin, DownloadCloud } from "lucide-react"
import { Button } from "../ui/button"

export function Footer() {
  return (
    <footer className="bg-muted/50 dark:bg-muted/10">
      <div className="container py-12 max-w-7xl">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="flex flex-col gap-2 md:col-span-1">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold">Nerida AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Agentic AI for the Future of Work.
            </p>
            <div className="mt-4 text-sm space-y-1">
              <a href="mailto:neridaai@gmail.com" className="text-muted-foreground hover:text-foreground block">neridaai@gmail.com</a>
              <a href="mailto:trapslashinc@gmail.com" className="text-muted-foreground hover:text-foreground block">trapslashinc@gmail.com</a>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 md:col-span-4 gap-8">
            <div>
              <h4 className="font-semibold">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#platform" className="text-muted-foreground hover:text-foreground">Overview</Link></li>
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                <li><Link href="#ethics" className="text-muted-foreground hover:text-foreground">Ethics</Link></li>
                <li><Link href="#use-cases" className="text-muted-foreground hover:text-foreground">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Developers</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#developers" className="text-muted-foreground hover:text-foreground">API Preview</Link></li>
                <li><Link href="#early-access" className="text-muted-foreground hover:text-foreground">Early Access</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Documentation (Soon)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Findme Messenger</h4>
              <p className="mt-4 text-sm text-muted-foreground">
                A messaging platform powered by Nerida Brain.
              </p>
              <Button asChild className="mt-4" size="sm">
                <a href="#">
                  <DownloadCloud />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Trapslash Inc. All rights reserved.</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
