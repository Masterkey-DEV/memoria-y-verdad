// @/components/initiatives-section.tsx
"use client";

import { useEffect, useState } from "react";
import { getIniciatives } from "@/actions/initiative.actions";
import { InitiativeCard } from "@/components/initiative-card";
import { getMediaUrl } from "@/lib/media";
import { useCategoryStore } from "@/store/useCategoryStore";
import { API_URL } from "@/const/api";
import { Lightbulb, Loader2 } from "lucide-react";

export function InitiativesSection() {
  // ✅ Lee directamente del store, igual que CategoriesSection
  const selectedCategoryName = useCategoryStore((s) => s.selectedCategoryName);

  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getIniciatives(selectedCategoryName);
      if (result.success) {
        setInitiatives(result.data);
        setError(null);
      } else {
        setError("No se pudieron cargar las iniciativas");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedCategoryName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Cargando iniciativas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20 mx-4">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section id="initiatives" className="px-4 py-8 max-w-7xl mx-auto">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          {selectedCategoryName
            ? `Iniciativas en ${selectedCategoryName}`
            : "Iniciativas Destacadas"}
        </h2>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Participa en programas diseñados para impulsar tu crecimiento,
          sanación y éxito profesional.
        </p>
      </div>

      {initiatives.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initiatives.map((initiative) => {
            const imageUrl = getMediaUrl(initiative.images?.[0]?.url, "/holder_iniciativas.jpeg");

            const categoryName = initiative.initiatives_categories?.[0]?.name;

            return (
              <InitiativeCard
                key={initiative.id}
                documentId={initiative.documentId}
                title={initiative.title}
                organization={
                  initiative.foundation?.name || "Organización Aliada"
                }
                description={initiative.objective}
                imageSrc={imageUrl}
                imageAlt={`Imagen de ${initiative.title}`}
                category={categoryName}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-muted rounded-3xl bg-muted/5">
          <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
          <p className="text-lg font-semibold text-foreground mb-1">
            No encontramos resultados
          </p>
          <p className="text-muted-foreground text-sm">
            No hay iniciativas activas en esta categoría. ¡Vuelve pronto!
          </p>
        </div>
      )}
    </section>
  );
}
