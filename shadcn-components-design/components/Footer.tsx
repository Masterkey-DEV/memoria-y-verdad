import { Share2, Mail, Globe, Heart, ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-slate-50/50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Layout principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Columna 1: Branding y Propósito (Narrativa de impacto) */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-primary mb-3 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Vitrina Social
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              El marketplace que conecta el talento de víctimas del conflicto con un mercado consciente. 
              Transformamos productos en historias de reconciliación y autonomía económica.
            </p>
          </div>

          {/* Columna 2: Recursos y Legal */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Plataforma
            </h4>
            <nav className="flex flex-col gap-3">
              <a
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ¿Cómo funciona?
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Vender en Vitrina
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Políticas de Privacidad
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Términos de Servicio
              </a>
            </nav>
          </div>

          {/* Columna 3: Contacto y Social */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Únete al Cambio
            </h4>
            <div className="flex gap-4">
              <a
                href="mailto:contacto@vitrinasocial.com"
                className="flex items-center justify-center h-11 w-11 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-11 w-11 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm"
                aria-label="Compartir"
              >
                <Share2 className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
              Hecho con <Heart className="h-3 w-3 text-red-500 fill-red-500" />{" "}
              desde Colombia.
            </p>
          </div>
        </div>

        {/* Línea final de Copyright */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy; {180} {new Date().getFullYear()} Vitrina Social.
            Impulsando la reconstrucción económica.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
              Sello de Confianza Verificado
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}