import { Leaf, Users, ShoppingBag, BookOpen } from "lucide-react";

const ITEMS = [
  {
    icon: ShoppingBag,
    title: "Materiales y herramientas",
    description:
      "Financiamos la compra de insumos para que los artesanos puedan producir y vender sin deudas.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "Capacitacion digital",
    description:
      "Talleres de fotografia de producto, ventas online y gestion basica para emprendedores.",
    color: "bg-accent/15 text-accent-foreground",
  },
  {
    icon: Users,
    title: "Operacion de fundaciones",
    description:
      "Apoyamos el funcionamiento de las organizaciones que acompanan a las comunidades en territorio.",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Leaf,
    title: "Expansion territorial",
    description:
      "Llevamos la plataforma a nuevas regiones del pais para incluir mas comunidades resilientes.",
    color: "bg-primary/10 text-primary",
  },
];

export function DonationDestination() {
  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Tu donacion en accion
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
            Cada peso tiene un destino claro
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
            El 100% de las donaciones se distribuye directamente entre los programas
            que generan impacto real en las comunidades.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1.5">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
