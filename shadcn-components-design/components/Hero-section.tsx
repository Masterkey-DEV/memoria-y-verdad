import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="px-4 py-12 md:py-20 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Contenedor de Imagen */}
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden order-first lg:order-last shadow-xl">
          <Image
            src="/holder.jpeg"
            alt="Comunidad participando en un proceso de reconciliación y aprendizaje"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Contenido de Texto */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground text-balance mb-6 tracking-tight">
            Forjando un futuro de{" "}
            <span className="text-primary">reconciliación</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
            Transformamos vidas conectando a víctimas del conflicto con
            proyectos productivos y redes de apoyo que reconstruyen el tejido
            social de Colombia.
          </p>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-64 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 py-7 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.02]">
              Ver impacto social
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-48 rounded-full py-7 text-lg font-semibold"
            >
              Nuestra historia
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
