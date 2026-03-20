// components/register/form-steps.tsx

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  error?: string;
  // Cambiamos de 'LucideIcon' a 'any' o un tipo mÃ¡s flexible
  icon?: React.ComponentType<{ className?: string }>; 
  children: React.ReactNode;
  required?: boolean;
}

export const FieldWrapper = ({ label, error, icon: Icon, children, required }: FieldWrapperProps) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium">
      {/* Si Icon existe, lo renderizamos como componente */}
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);


export const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-1.5 flex-1 rounded-full transition-all duration-500",
          i + 1 <= current ? "bg-primary" : "bg-muted"
        )}
      />
    ))}
  </div>
);