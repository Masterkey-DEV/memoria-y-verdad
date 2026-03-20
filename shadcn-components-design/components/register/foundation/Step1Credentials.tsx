// components/register/foundation/Step1Credentials.tsx
"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { FieldWrapper } from "@/components/register/form-steps";
import type { FormValues } from "@/schemas/foundation";

interface Props {
  form: UseFormReturn<FormValues>;
}

export function Step1Credentials({ form }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-xl font-bold italic tracking-tight">Acceso Administrativo</h3>
        <p className="text-sm text-muted-foreground">Configura las credenciales de tu panel.</p>
      </header>

      <FieldWrapper label="Usuario" error={form.formState.errors.username?.message} required>
        <input
          {...form.register("username")}
          placeholder="ej. fundacion_paz"
          className="flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
        />
      </FieldWrapper>

      <FieldWrapper label="Correo electrónico" error={form.formState.errors.email?.message} required>
        <input
          {...form.register("email")}
          type="email"
          placeholder="contacto@organizacion.org"
          className="flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
        />
      </FieldWrapper>

      <FieldWrapper label="Contraseña" error={form.formState.errors.password?.message} required>
        <div className="relative">
          <input
            {...form.register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            className="flex h-12 w-full rounded-xl border border-input bg-slate-50/50 px-4 py-2 text-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/10 outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FieldWrapper>
    </div>
  );
}