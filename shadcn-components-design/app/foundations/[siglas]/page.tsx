// @/app/fundaciones/[siglas]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getFoundationBySiglas } from "@/actions/foundation.actions";
import { getMediaUrl } from "@/lib/media";
import type { Initiative } from "@/types/initiative";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowLeft, Building2, Lightbulb, Users, MapPin } from "lucide-react";

interface Props {
  params: Promise<{ siglas: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siglas } = await params;
  const result = await getFoundationBySiglas(siglas);
  if (!result.success || !result.data) return { title: "Fundación no encontrada" };
  return {
    title: `${result.data.name} | Impact Ventures`,
    description: `Conoce los programas e iniciativas de ${result.data.name}.`,
  };
}

export default async function FoundationDetailPage({ params }: Props) {
  const { siglas } = await params;
  const result = await getFoundationBySiglas(siglas);
  if (!result.success || !result.data) notFound();

  const foundation = result.data;

  // ✅ Strapi devuelve "iniciatives" (typo en el schema — respetar tal cual)
  const initiatives: Initiative[] = foundation.iniciatives ?? [];
  const initiativeCount = initiatives.length;
  const logoUrl = getMediaUrl(foundation.image?.url, "/holder_fundaciones.jpeg");

  return (
    <main className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">

          <Link
            href="/foundations"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors group mb-10"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Todas las fundaciones
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-3xl overflow-hidden bg-white border border-border shadow-sm shrink-0">
              <Image src={logoUrl} alt={`Logo de ${foundation.name}`} fill className="object-contain p-3" sizes="112px" priority />
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {foundation.siglas && (
                  <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 text-xs font-black tracking-widest uppercase">
                    {foundation.siglas}
                  </Badge>
                )}
                {foundation.location && (
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                    <MapPin className="h-3 w-3" />
                    {foundation.location}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight italic uppercase leading-tight text-foreground">
                {foundation.name}
              </h1>

              {foundation.description && (
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                  {foundation.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2.5 bg-background border border-border rounded-2xl px-4 py-2.5">
                  <Lightbulb className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xl font-black leading-none text-foreground">{initiativeCount}</p>
                    <p className="text-muted-foreground text-[11px] mt-0.5">
                      {initiativeCount === 1 ? "Iniciativa" : "Iniciativas"}
                    </p>
                  </div>
                </div>
                {foundation.memberCount != null && (
                  <div className="flex items-center gap-2.5 bg-background border border-border rounded-2xl px-4 py-2.5">
                    <Users className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xl font-black leading-none text-foreground">{foundation.memberCount}</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5">Miembros</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── INICIATIVAS ── */}
      <section className="max-w-5xl mx-auto px-4 py-14 md:py-20">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Programas activos</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              Iniciativas de <span className="text-primary">{foundation.siglas ?? foundation.name}</span>
            </h2>
          </div>
          <Building2 className="h-8 w-8 text-muted-foreground/20 shrink-0" />
        </div>

        {initiativeCount > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {initiatives.map((initiative) => {
              const initImgUrl = getMediaUrl(initiative.images?.[0]?.url);
              const categoryName = initiative.initiatives_categories?.[0]?.name;
              // ✅ campo correcto: "users"
              const memberCount = initiative.users?.length ?? 0;

              return (
                <Link key={initiative.id} href={`/initiatives/${initiative.documentId}`} className="group block">
                  <div className="rounded-3xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

                    {initiative.images?.[0] && (
                      <div className="relative h-44 w-full overflow-hidden bg-muted">
                        <Image
                          src={initImgUrl}
                          alt={initiative.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {categoryName && (
                          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest rounded-full px-3">
                            {categoryName}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black leading-snug text-foreground group-hover:text-primary transition-colors">
                          {initiative.title}
                        </h3>
                        <ArrowUpRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-all shrink-0 mt-0.5" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{initiative.objective}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Ver detalles →</span>
                        {memberCount > 0 && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                            <Users className="h-3 w-3" />
                            {memberCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl bg-muted/10">
            <Lightbulb className="mx-auto h-14 w-14 text-muted-foreground/20 mb-5" />
            <h3 className="text-lg font-black mb-2">Sin iniciativas aún</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
              Esta fundación no ha publicado iniciativas todavía. ¡Vuelve pronto!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}