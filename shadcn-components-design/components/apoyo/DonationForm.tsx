"use client";

import { useState } from "react";
import { Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 250000];

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const IMPACT_MAP: Record<number, string> = {
  10000: "cubre el material para una artesania vendible",
  25000: "financia una semana de capacitacion digital",
  50000: "ayuda a una familia a costear su primer envio",
  100000: "abre una vitrina digital a un emprendedor por un mes",
  250000: "patrocina la participacion en una feria artesanal regional",
};

export function DonationForm() {
  const [selected, setSelected] = useState<number | null>(50000);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = custom ? parseInt(custom.replace(/\D/g, ""), 10) : selected;

  const impact =
    selected && !custom ? IMPACT_MAP[selected] : null;

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setCustom(raw);
    setSelected(null);
  }

  function handlePreset(amount: number) {
    setSelected(amount);
    setCustom("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1000) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="font-serif text-2xl text-foreground mb-2">
            Gracias por tu generosidad
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Tu donacion de{" "}
            <strong className="text-foreground">
              {finalAmount ? CURRENCY_FORMATTER.format(finalAmount) : ""}
            </strong>{" "}
            esta siendo procesada. Recibiras un correo de confirmacion.
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-sm text-muted-foreground"
          onClick={() => {
            setSubmitted(false);
            setSelected(50000);
            setCustom("");
          }}
        >
          Hacer otra donacion
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Montos predefinidos */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Elige un monto
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {PRESET_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePreset(amount)}
              className={cn(
                "rounded-xl border px-3 py-3 text-sm font-semibold transition-all",
                selected === amount && !custom
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              {CURRENCY_FORMATTER.format(amount)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setCustom("");
            }}
            className={cn(
              "rounded-xl border px-3 py-3 text-sm font-semibold transition-all col-span-1",
              !selected && !custom
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            )}
          >
            Otro
          </button>
        </div>
      </div>

      {/* Monto personalizado */}
      {(!selected || custom !== "") && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Monto personalizado (COP)
          </p>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Ej: 75000"
            value={custom}
            onChange={handleCustomChange}
            className="text-lg font-semibold h-12 rounded-xl"
          />
        </div>
      )}

      {/* Banner de impacto */}
      {impact && (
        <div className="rounded-xl bg-accent/10 border border-accent/30 px-4 py-3">
          <p className="text-sm text-foreground leading-snug">
            <span className="font-semibold text-accent-foreground">Con este monto </span>
            {impact}.
          </p>
        </div>
      )}

      {/* CTA */}
      <Button
        type="submit"
        disabled={!finalAmount || finalAmount < 1000}
        className="w-full h-12 rounded-xl font-bold text-base gap-2 bg-primary hover:bg-primary/90"
      >
        <Heart className="h-4 w-4" />
        Donar{" "}
        {finalAmount && finalAmount >= 1000
          ? CURRENCY_FORMATTER.format(finalAmount)
          : ""}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Pago seguro &middot; Donacion con fines sociales &middot; Recibe soporte de donacion
      </p>
    </form>
  );
}
