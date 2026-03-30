"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "¿Donde va exactamente mi donacion?",
    answer:
      "El 100% se distribuye entre tres fondos: materiales e insumos para artesanos (50%), capacitacion y formacion digital (30%) y operacion de fundaciones aliadas en territorio (20%). Publicamos informes trimestrales con el detalle.",
  },
  {
    question: "¿Puedo elegir a que fundacion o comunidad apoyar?",
    answer:
      "Si. En el formulario de donacion puedes seleccionar una fundacion especifica de nuestra red aliada. Si no eliges ninguna, el monto se distribuye donde hay mayor necesidad en ese momento.",
  },
  {
    question: "¿Recibo algun comprobante de mi donacion?",
    answer:
      "Si, inmediatamente despues de procesar tu donacion te enviamos un correo electronico con el recibo y el detalle del destino. Para donaciones mayores a $500.000 COP puedes solicitar un certificado formal.",
  },
  {
    question: "¿Puedo hacer donaciones periodicas?",
    answer:
      "Proximamente habilitaremos la opcion de donacion mensual recurrente. Si quieres comprometerte con un apoyo sostenido, escribenos a contacto@vitrinasocial.com y te ayudamos a configurarlo.",
  },
  {
    question: "¿Por que no simplemente comprar productos en vez de donar?",
    answer:
      "Ambas formas de apoyo son valiosas. Cuando compras, el impacto llega directamente al artesano a traves de la venta. Cuando donas, financias la infraestructura de soporte — capacitacion, materiales y acompanamiento — que hace posible que ese artesano pueda vender.",
  },
  {
    question: "¿Vitrina Social es una organizacion sin animo de lucro?",
    answer:
      "Somos un emprendimiento de impacto social. Tenemos un modelo de negocio que nos permite operar de forma sostenible (comision por ventas), pero las donaciones se gestionan a traves de nuestras fundaciones aliadas que si tienen figura juridica de ONG.",
  },
];

export function DonationFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-foreground">
            Todo lo que necesitas saber
          </h2>
        </div>

        <div className="divide-y divide-border">
          {FAQS.map(({ question, answer }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "text-base font-medium transition-colors",
                      isOpen ? "text-primary" : "text-foreground"
                    )}
                  >
                    {question}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground">
                    {isOpen ? (
                      <Minus className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
