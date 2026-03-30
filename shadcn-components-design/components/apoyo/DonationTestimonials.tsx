const TESTIMONIALS = [
  {
    quote:
      "Gracias a Vitrina Social pude vender mis mochilas a personas de Bogota y Medellin que jamas hubiera conocido. Ahora tengo pedidos todos los meses.",
    name: "Rosalba Ipuana",
    role: "Tejedora wayuu, La Guajira",
    initial: "R",
  },
  {
    quote:
      "Con el taller de fotografia aprendi a mostrar mejor mis piezas. Mis ventas subieron un 60% en tres meses. No lo podia creer.",
    name: "Edilberto Torres",
    role: "Tallador en madera, Boyaca",
    initial: "E",
  },
  {
    quote:
      "La fundacion me apoyo para conseguir la materia prima. Ya no tengo que pedir prestado para producir. Eso cambia todo.",
    name: "Carmen Lucia Vidal",
    role: "Ceramista, Mompos",
    initial: "C",
  },
];

export function DonationTestimonials() {
  return (
    <section className="py-20 bg-secondary/40 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Impacto real
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
            Voces de quienes ya cambiaron su historia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, initial }) => (
            <figure
              key={name}
              className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-5"
            >
              {/* Comilla decorativa */}
              <span
                aria-hidden
                className="font-serif text-6xl leading-none text-primary/20 select-none -mb-4"
              >
                &ldquo;
              </span>
              <blockquote className="text-sm text-foreground leading-relaxed flex-1">
                {quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{initial}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
