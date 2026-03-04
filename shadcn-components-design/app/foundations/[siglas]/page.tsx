// @/app/fundaciones/[siglas]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { getFoundationBySiglas } from "@/actions/foundation.actions";
import { ArrowUpRight } from "lucide-react";

interface Props {
  params: Promise<{ siglas: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { siglas } = await params;
  const result = await getFoundationBySiglas(siglas);

  if (!result.success || !result.data) {
    return { title: "Fundación no encontrada" };
  }

  return {
    title: `${result.data.name} | Impact Ventures`,
    description: `Conoce los programas e iniciativas de ${result.data.name}.`,
  };
}

export default async function FoundationDetailPage({ params }: Props) {
  const { siglas } = await params;
  const result = await getFoundationBySiglas(siglas);

  if (!result.success || !result.data) {
    notFound();
  }

  const foundation = result.data;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{foundation.name}</h1>
          <p className="text-muted-foreground text-lg">
            Siglas: {foundation.siglas}
          </p>
        </div>
      </div>

      {/* Iniciativas */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">Iniciativas</h2>

        {foundation.iniciatives?.length ? (
          <div className="grid md:grid-cols-2 gap-8">
            {foundation.iniciatives.map((initiative: any) => (
              <Link
                key={initiative.id}
                href={`/initiatives/${initiative.documentId}`}
                className="group block"
              >
                <div className="p-6 rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {initiative.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {initiative.objective}
                  </p>

                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Ver detalles
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Esta fundación aún no tiene iniciativas registradas.
          </p>
        )}
      </section>
    </main>
  );
}
