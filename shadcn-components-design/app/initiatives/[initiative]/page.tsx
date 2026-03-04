// @/app/initiatives/[initiative]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitiativeByDocumentId } from "@/actions/initiative.actions";
import { API_URL } from "@/const/api";
import { ArrowLeft, Building2 } from "lucide-react";

interface PageProps {
  params: Promise<{ initiative: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { initiative } = await params;
  const result = await getInitiativeByDocumentId(initiative);

  if (!result.success || !result.data) return {};

  return {
    title: `${result.data.title} | Reintegration Portal`,
    description: result.data.objective,
  };
}

export default async function InitiativeDetailPage({ params }: PageProps) {
  const { initiative } = await params;

  const result = await getInitiativeByDocumentId(initiative);

  if (!result.success || !result.data) {
    notFound();
  }

  const data = result.data;

  const imageUrl = data.images?.[0]?.url
    ? `${API_URL}${data.images[0].url}`
    : "/placeholder.jpg";

  const categoryName =
    data.initiatives_categories?.[0]?.name || "Sin categoría";

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[420px] md:h-[520px] w-full">
        <Image
          src={imageUrl}
          alt={`Imagen de ${data.title}`}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-black/60 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-14 text-white">
            <Badge className="mb-4 bg-primary text-primary-foreground uppercase tracking-wider">
              {categoryName}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight max-w-3xl">
              {data.title}
            </h1>

            <p className="mt-4 text-lg md:text-xl max-w-2xl text-white/80">
              {data.objective}
            </p>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-5xl mx-auto px-6 py-20 space-y-16">
        {/* Información principal */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-8">
            {data.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Sobre esta iniciativa
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {data.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="p-6 rounded-3xl border bg-muted/20 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Organización
              </h3>

              <p className="text-muted-foreground">
                {data.foundation?.name || "Organización Aliada"}
              </p>
            </div>

            <div className="p-6 rounded-3xl border bg-muted/20 space-y-6">
              <Button className="w-full rounded-full py-6 font-semibold text-base">
                Postularme ahora
              </Button>

              <Link href="/initiatives">
                <Button
                  variant="outline"
                  className="w-full rounded-full py-6 font-semibold text-base"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a iniciativas
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
