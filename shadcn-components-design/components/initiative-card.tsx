import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InitiativeCardProps {
  title: string;
  organization: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badge: string;
  badgeVariant: "featured" | "new";
}

export function InitiativeCard({
  title,
  organization,
  description,
  imageSrc,
  imageAlt,
  badge,
  badgeVariant,
}: InitiativeCardProps) {
  return (
    <Card className="overflow-hidden border border-border rounded-2xl w-full h-full hover:shadow-md hover:-translate-y-1 transition-all ease-in">
      <div className="relative w-full h-48">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <Badge
            className={`text-xs font-semibold shrink-0 ${
              badgeVariant === "featured"
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-primary/10 text-primary border-primary/20"
            }`}
            variant="outline"
          >
            {badge}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">By {organization}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <Button
          variant="outline"
          className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-semibold bg-transparent"
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}
