import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function DonationAlternative() {
  return (
    <section className="py-20 border-t border-border bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-background/40">
              Otra forma de apoyar
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-balance leading-tight">
              Si prefieres, puedes apoyar{" "}
              <span className="text-accent">comprando directamente</span>
            </h2>
            <p className="text-background/60 leading-relaxed">
              Cada producto en Vitrina Social fue creado por un artesano que supero el
              conflicto. Tu compra llega integra a su bolsillo: sin intermediarios
              que se queden con la mayor parte.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href="/products"
              className="group flex items-center justify-between bg-background/5 hover:bg-background/10 border border-background/10 rounded-2xl px-7 py-5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-background">Explorar el catalogo</p>
                  <p className="text-sm text-background/50">
                    Artesanias, textiles y mas
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-background/30 group-hover:text-background/60 transition-colors" />
            </Link>
            <Link
              href="/foundations"
              className="group flex items-center justify-between bg-background/5 hover:bg-background/10 border border-background/10 rounded-2xl px-7 py-5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">F</span>
                </div>
                <div>
                  <p className="font-semibold text-background">Conocer las fundaciones</p>
                  <p className="text-sm text-background/50">
                    Organizaciones aliadas en todo el pais
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-background/30 group-hover:text-background/60 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
