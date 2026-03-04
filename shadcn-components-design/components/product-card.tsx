// @/components/product-card.tsx
"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  price: number;
  imageSrc: string;
  category?: string;
  shortDescription?: string; // Usamos el campo que tienes en Strapi
  href: string;
}

export function ProductCard({
  name,
  price,
  imageSrc,
  category,
  shortDescription,
  href,
}: ProductCardProps) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  return (
    <Link
      href={href}
      className="group relative flex flex-col w-full bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Contenedor de Imagen */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={imageSrc || "/placeholder-product.jpg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {category && (
          <Badge className="absolute top-3 left-3 z-20 bg-background/80 backdrop-blur-md text-foreground">
            {category}
          </Badge>
        )}

        {/* Overlay visual de "Ver detalle" */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 p-2 rounded-full shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Eye className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          {shortDescription && (
            <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
              {shortDescription}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <span className="text-xl font-extrabold text-primary">
            {formatter.format(price)}
          </span>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-semibold">
            Click para ver detalles
          </p>
        </div>
      </div>
    </Link>
  );
}
