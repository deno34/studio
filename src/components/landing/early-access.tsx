"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Lock } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  intendedUse: z.string().min(10, { message: "Please describe your intended use case." }),
  timeline: z.string().nonempty({ message: "Please select an integration timeline." }),
})

export function EarlyAccess() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      company: "",
      intendedUse: "",
      timeline: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Registration successful!",
      description: "Thank you for your interest. We'll be in touch soon.",
    })
    form.reset()
  }

  return (
    <section id="early-access" className="py-20 md:py-28">
      <div className="container max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Request Early Access</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Be among the first to build with Nerida AI. Fill out the form below to join our early access program.
          </p>
        </div>
        <div className="mt-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="you@company.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="intendedUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intended Use Case</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Automating customer support tickets, optimizing logistics..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Integration Timeline</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-3 months">1-3 Months</SelectItem>
                        <SelectItem value="3-6 months">3-6 Months</SelectItem>
                        <SelectItem value="6+ months">6+ Months</SelectItem>
                        <SelectItem value="just exploring">Just Exploring</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Register for Early Access
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            <span>Your data is protected. We never sell or share information.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
