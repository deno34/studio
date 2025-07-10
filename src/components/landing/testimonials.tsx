"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function Testimonials() {
  const reviews = [
    {
      name: "Sarah L.",
      title: "CEO, Innovate Inc.",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      review: "Nerida AI transformed our customer support. Resolution times are down 60%, and our team can now focus on complex issues. It's like having a superpower."
    },
    {
      name: "Mike T.",
      title: "Marketing Director, ScaleUp",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
      review: "The speed at which Nerida drafts marketing strategies is a game-changer. It gives us a solid, data-driven foundation to build on, saving us days of work."
    },
    {
      name: "Jessica P.",
      title: "Lead Developer, TechFlow",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
      review: "We've integrated Nerida into our Slack for automated reporting and alerts. It's reduced interruptions and kept the entire team in sync effortlessly."
    },
    {
      name: "David Chen",
      title: "COO, Global Logistics",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
      review: "We automated our entire supply chain reporting with Nerida. The efficiency gains have been incredible, and we can now anticipate bottlenecks before they happen."
    },
    {
        name: "Emily Rodriguez",
        title: "Founder, Creative Co.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
        review: "As a small startup, Nerida is our entire marketing and operations team. It handles social media scheduling, drafts blog posts, and manages our inbox. Indispensable."
    },
    {
        name: "Alex Johnson",
        title: "Head of Product, SaaS Solutions",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
        review: "The ability to create custom logic layers has allowed us to build a truly bespoke agent for our unique business needs. The flexibility is unparalleled."
    },
    {
        name: "Priya Sharma",
        title: "E-commerce Manager, Urban Style",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e290267041",
        review: "Our inventory management has never been more accurate. Nerida's AI predicts demand and automates reordering, saving us from stockouts and overstocking."
    },
    {
        name: "Tom Williamson",
        title: "Finance Controller, BuildRight",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e290267042",
        review: "Monthly financial reporting used to take a week. With Nerida, it's done in under an hour, with greater accuracy and detailed insights we never had before."
    },
    {
        name: "Chloe Dubois",
        title: "HR Director, PeopleFirst",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e290267043",
        review: "Onboarding new employees is so much smoother now. Nerida handles the paperwork, schedules orientation, and answers common questions, freeing up our team."
    },
    {
        name: "Ben Carter",
        title: "IT Administrator, SecureNet",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e290267045",
        review: "The ethical principles, especially around data privacy, were a huge factor for us. We trust Nerida with our sensitive information, and it delivers."
    }
  ]

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
      <div className="container max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by Teams Worldwide</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Don't just take our word for it. Here's what our users are saying about their new AI employee.
          </p>
        </div>
        <Carousel 
          opts={{
            align: "start",
          }}
          className="w-full mt-12"
        >
          <CarouselContent>
            {reviews.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                 <Card className="h-full bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out hover:scale-105">
                    <CardContent className="p-6 flex flex-col h-full">
                      <p className="text-muted-foreground flex-1">"{review.review}"</p>
                      <div className="mt-6 flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.name} />
                          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{review.name}</h4>
                          <p className="text-sm text-muted-foreground">{review.title}</p>
                        </div>
                      </div>
                    </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
