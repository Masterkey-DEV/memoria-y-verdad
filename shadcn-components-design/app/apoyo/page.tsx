import type { Metadata } from "next";
import { Heart, TrendingUp, Users } from "lucide-react";
import { DonationForm } from "@/components/apoyo/DonationForm";
import { DonationDestination } from "@/components/apoyo/DonationDestination";
import { DonationTestimonials } from "@/components/apoyo/DonationTestimonials";
import { DonationFAQ } from "@/components/apoyo/DonationFAQ";
import { DonationAlternative } from "@/components/apoyo/DonationAlternative";

export const metadata: Metadata = {
  title: "Apoyar | Vitrina Social",
  description:
    "Tu donacion financia materiales, capacitacion y el acompanamiento que necesitan los artesanos colombianos para integrarse a la economia digital.",
};

const IMPACT_STATS = [
  {
    icon: Users,
    value: "340+",
    label: "Artesanos activos en la plataforma",
  },
  {
    icon: TrendingUp,
    value: "78%",
    label: "Incremento promedio en ventas tras capacitacion",
  },
  {
    icon: Heart,
    value: "12",
    label: "Fundaciones aliadas en todo el pais",
  },
];

export default function ApoyoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Columna izquierda: texto */}
            <div className="pb-16 space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                <Heart className="h-3.5 w-3.5" />
                Apoyar a Vitrina Social
              </span>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-tight text-foreground text-balance">
                Tu apoyo no es caridad.
                <br />
                <span className="text-primary">Es inversion en dignidad.</span>
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
                En Colombia hay miles de artesanos con talento extraordinario que
                no tienen acceso al mercado digital. Con tu donacion financiamos los
                puentes que los conectan con el mundo.
              </p>

              {/* Estadisticas de impacto */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {IMPACT_STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4 text-accent" />
                      <span className="text-2xl font-black text-foreground tracking-tight">
                        {value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: formulario sticky */}
            <div className="lg:sticky lg:top-24 pb-16">
              <div className="bg-background border border-border rounded-3xl shadow-sm p-8">
                <div className="mb-6">
                  <h2 className="font-serif text-xl text-foreground mb-1">
                    Hacer una donacion
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Elige el monto que quieras aportar, una sola vez.
                  </p>
                </div>
                <DonationForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINO DE LA DONACION ────────────────────────────── */}
      <DonationDestination />

      {/* ── TESTIMONIOS ───────────────────────────────────────── */}
      <DonationTestimonials />

      {/* ── ALTERNATIVA DE APOYO ──────────────────────────────── */}
      <DonationAlternative />

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <DonationFAQ />
    </div>
  );
}
