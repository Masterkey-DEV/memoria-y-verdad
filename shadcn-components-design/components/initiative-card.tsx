// @/components/initiative-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Building2 } from "lucide-react";

interface InitiativeCardProps {
  documentId: string;
  title: string;
  organization: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  category?: string; // initiatives_categories[0].name
}

export function InitiativeCard({
  documentId,
  title,
  organization,
  description,
  imageSrc,
  imageAlt,
  category,
}: InitiativeCardProps) {
  return (
    <Link
      href={`/initiatives/${documentId}`}
      className="group flex flex-col bg-card border border-border/50 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 h-full"
    >
      <div className="relative w-full h-52 overflow-hidden bg-muted">
        <Image
          src={imageSrc || "/placeholder.jpg"}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {category && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-black tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="shrink-0 h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{organization}</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-grow">
          {description}
        </p>

        <div className="pt-2 border-t border-border/40">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors">
            Ver iniciativa →
          </span>
        </div>
      </div>
    </Link>
  );
}
