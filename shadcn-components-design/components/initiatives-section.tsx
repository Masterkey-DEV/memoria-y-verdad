import { apiURL } from "@/const/api";
import { InitiativeCard } from "@/components/initiative-card";
import { getIniciatives } from "@/actions/initiative.actions";
import { Initiative } from "@/types/initiative";

export async function InitiativesSection() {
  const result = await getIniciatives();

  if (!result.success) {
    return (
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <p>Error cargando iniciativas</p>
      </section>
    );
  }

  const initiatives: Initiative[] = result.data;

  return (
    <section id="initiatives" className="px-4 py-12 md:py-24 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8 md:mb-12">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Active Initiatives
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl">
            Join a program designed to foster growth, healing, and professional
            success.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {initiatives.map((initiative: Initiative) => {
          const imageUrl = initiative.imagenes?.[0]?.url
            ? `${apiURL}${initiative.imagenes[0].url}`
            : "/placeholder.jpg";

          return (
            <div key={initiative.id} className="flex h-full">
              <InitiativeCard
                title={initiative.titulo}
                organization={initiative.foundation?.nombre || "Foundation"}
                description={initiative.objetivo}
                imageSrc={imageUrl}
                imageAlt={initiative.titulo}
                badge="NEW"
                badgeVariant="new"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
