// @/app/productos/page.tsx
import { ProductsSection } from "@/components/Product-section";
// Asumiendo que tienes un componente de filtros de categorías
// import { CategoryFilter } from "@/components/CategoryFilter";

export const metadata = {
  title: "Catálogo de Productos | Impact Ventures",
  description:
    "Explora nuestra selección de productos con impacto social y comunitario.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header de la Sección */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
              Nuestro <span className="text-primary">Catálogo</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Descubre productos creados por emprendimientos locales. Cada
              compra es un voto de confianza para el crecimiento de nuestra
              comunidad.
            </p>
          </div>
        </div>
      </div>

      {/* Área de Filtros (Opcional, si tienes el componente) */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Aquí iría tu componente de categorías que actualiza useCategoryStore */}
          {/* <CategoryFilter /> */}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Filtra por categoría para encontrar lo que buscas
          </p>
        </div>
      </div>

      {/* Listado de Productos */}
      <div className="py-12">
        <ProductsSection />
      </div>

      {/* Footer de Apoyo o Newsletter */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="bg-primary rounded-[3rem] p-8 md:p-16 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="space-y-4 z-10">
            <h2 className="text-3xl md:text-4xl font-bold italic">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-primary-foreground/80 max-w-md">
              Estamos constantemente sumando nuevos emprendedores a nuestra red.
              Contáctanos si tienes un proyecto que quieras mostrar.
            </p>
          </div>
          <button className="bg-background text-foreground px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform z-10 shadow-xl">
            Postular mi Proyecto
          </button>
          {/* Círculo decorativo de fondo */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>
    </main>
  );
}
