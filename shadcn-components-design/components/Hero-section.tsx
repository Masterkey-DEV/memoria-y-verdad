import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="px-4 py-12 md:py-20 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden order-first lg:order-last shadow-2xl">
          <Image
            src="/ventana.png" 
            alt="Emprendedores locales integrándose a la economía digital"
            fill
            className="object-cover"
            priority
          />

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
            <p className="text-sm font-bold text-primary">Origen Verificado ✓</p>
          </div>
        </div>


        <div className="flex flex-col items-start">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4">
            El Marketplace de Impacto de Colombia
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground text-balance mb-6 tracking-tight">
            Cada producto vendido es una vida que se <span className="text-primary">reconstruye</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
            Conectamos a emprendedores víctimas del conflicto con un mercado consciente. 
            Sin intermediarios, con pagos seguros y confianza verificada.
          </p>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="w-full sm:w-auto">
            
            <Button className="w-full sm:w-64 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 py-7 text-lg font-semibold shadow-lg transition-transform hover:scale-[1.02]">
              Comprar con impacto
            </Button>
            </Link>
            
            <Link href="/about" className="w-full sm:w-auto">
              
            <Button
              variant="outline"
              className="w-full sm:w-48 rounded-full py-7 text-lg font-semibold border-2"
            >
              Vender mi producto
            </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground italic">
            +100 emprendedores listos para digitalizar su talento.
          </p>
        </div>
      </div>
    </section>
  );
}