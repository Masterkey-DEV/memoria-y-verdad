import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="px-4 py-12 md:py-20 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Contenedor de Imagen: Primero en móvil, segundo en desktop (opcional) */}
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden order-first lg:order-last shadow-xl">
          <Image
            src="holder.jpeg"
            alt="People collaborating in a workshop setting"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Contenido de Texto */}
        <div className="flex flex-col items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground text-balance mb-6 tracking-tight">
            A New Path <span className="text-primary">Forward</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
            Connecting conflict victims in Colombia with meaningful
            opportunities for social reintegration and community building.
          </p>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <Button className="w-full sm:w-64 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 py-7 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.02]">
              Explore Initiatives
            </Button>
            {/* Botón secundario opcional para mejorar el balance visual en desktop */}
            <Button
              variant="outline"
              className="w-full sm:w-48 rounded-full py-7 text-lg font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
