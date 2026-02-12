import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const stories = [
  {
    quote:
      "The reintegration program gave me a second chance. Today I have my own tailoring business and feel like part of my community again.",
    name: "Maria Garcia",
    location: "Medellin, Colombia",
    avatar: "/images/avatar-maria.jpg",
  },
  {
    quote:
      "Joining the program wasn't easy, but it was worth it. I was at a low point and now I understand my potential.",
    name: "Carlos Mendez",
    location: "Bogota, Colombia",
    avatar: "/images/avatar-carlos.jpg",
  },
]

export function SuccessStories() {
  return (
    <section className="px-4 py-8">
      <h2 className="text-xl font-bold text-foreground mb-6">
        Success Stories
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
        {stories.map((story) => (
          <Card
            key={story.name}
            className="min-w-[280px] max-w-[300px] shrink-0 snap-start border border-border rounded-2xl"
          >
            <CardContent className="p-5">
              <Quote className="h-8 w-8 text-primary mb-3" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                {`"${story.quote}"`}
              </p>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={story.avatar || "/placeholder.svg"}
                    alt={`Portrait of ${story.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {story.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {story.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
