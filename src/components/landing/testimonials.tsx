import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    }
  ]

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-muted/50 dark:bg-muted/10">
      <div className="container max-w-7xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by Teams Worldwide</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Don't just take our word for it. Here's what our early users are saying about their new AI employee.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {reviews.map((review, index) => (
             <Card key={index} className="bg-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out hover:scale-105">
                <CardContent className="p-6">
                  <p className="text-muted-foreground">"{review.review}"</p>
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
          ))}
        </div>
      </div>
    </section>
  )
}
