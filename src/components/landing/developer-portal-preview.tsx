import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const codeSnippet = `
import { NeridaAI } from 'nerida-ai-sdk';

const nerida = new NeridaAI({
  apiKey: process.env.NERIDA_API_KEY,
});

async function run() {
  const agent = nerida.getAgent('support-router');

  const result = await agent.run({
    query: 'My order #12345 has not arrived yet.',
  });

  console.log(result.response);
}

run();
`

export function DeveloperPortalPreview() {
  return (
    <section id="developers" className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
      <div className="container max-w-7xl grid md:grid-cols-2 gap-12 items-center px-4">
        <div className="md:pr-8">
          <h2 className="text-3xl md:text-4xl font-bold">Built for Developers</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Our API-first architecture and comprehensive SDKs make it easy to integrate agentic capabilities into any application. The developer portal is coming soon.
          </p>
          <ul className="mt-6 space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2"><span>-</span> SDKs for Node.js, Python, and Go (planned)</li>
            <li className="flex items-center gap-2"><span>-</span> Comprehensive API documentation</li>
            <li className="flex items-center gap-2"><span>-</span> Secure and scalable infrastructure</li>
          </ul>
           <Button size="lg" className="mt-8" asChild>
              <Link href="#early-access">Join the Waitlist</Link>
            </Button>
        </div>
        <div>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="bg-zinc-800 rounded-t-lg p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <pre className="p-4 text-sm bg-zinc-900 text-white overflow-x-auto rounded-b-lg">
                <code className="font-code">{codeSnippet.trim()}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
