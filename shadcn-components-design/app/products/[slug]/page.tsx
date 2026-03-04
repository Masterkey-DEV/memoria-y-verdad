// @/app/productos/[slug]/page.tsx
import { getProductBySlug } from "@/actions/product.actions";
import { API_URL } from "@/const/api";
import { Product } from "@/types/product";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product: Product = result.data;
  const imageUrl = product.images?.[0]?.url
    ? `${API_URL}${product.images[0].url}`
    : "/placeholder.jpg";

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      {/* Botón Volver */}
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Explorar más productos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Galería de Imagen */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border bg-muted">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.featured && ( // Campo featured de tu modelo
              <Badge className="absolute top-6 left-6 bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-lg">
                Destacado
              </Badge>
            )}
          </div>
        </div>

        {/* Información y Acciones */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            {product.product_categories?.[0] && ( // Relación de tu modelo
              <Badge
                variant="secondary"
                className="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wider"
              >
                {product.product_categories[0].name}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
              {product.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              "{product.shortDescription}" {/* Campo de tu modelo */}
            </p>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary">
              ${product.price.toLocaleString("es-CO")}
            </span>
            {product.stock > 0 && ( // Campo stock de tu modelo
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                {product.stock} disponibles
              </span>
            )}
          </div>

          <div className="prose prose-gray py-6 border-y border-border/60">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Historia del producto
            </h3>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          {/* Botones de Acción Estéticos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Button className="rounded-2xl h-16 text-lg font-bold gap-3 shadow-xl shadow-primary/20 bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-6 w-6" />
              Apoyar Proyecto
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 rounded-2xl h-16 border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group transition-all"
              >
                <Heart className="h-6 w-6 transition-transform group-hover:scale-125" />
                Me gusta
              </Button>
              <Button
                variant="outline"
                className="aspect-square p-0 rounded-2xl h-16 border-2"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Al contactar, hablas directamente con los creadores de esta
            iniciativa.
          </p>
        </div>
      </div>
    </main>
  );
}
