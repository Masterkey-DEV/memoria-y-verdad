"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { handleRegister } from "@/actions/registerFoundation.actions";

// Esquema de validación
const formSchema = z.object({
  // Datos del Usuario
  username: z.string().min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  // Datos de la Fundación (Basado en tu imagen)
  foundationName: z.string().min(2, "El nombre es obligatorio"),
  siglas: z
    .string()
    .min(2, "Las siglas son obligatorias")
    .max(10, "Máximo 10 caracteres"),
  logo: z.any().optional(), // Para el campo 'image'
});

export default function RegisterFoundationPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      foundationName: "",
      siglas: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleRegister(values);
    console.log(values);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Registro de Fundación</CardTitle>
          <CardDescription>
            Crea tu cuenta de usuario y los datos de tu fundación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SECCIÓN USUARIO */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Datos de Acceso
                  </h3>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="ej. juandiaz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contacto@fundacion.org"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="md:hidden" />

                {/* SECCIÓN FUNDACIÓN */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Datos de la Fundación
                  </h3>
                  <FormField
                    control={form.control}
                    name="foundationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de la Fundación</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre oficial" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siglas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Siglas / Acrónimo</FormLabel>
                        <FormControl>
                          <Input placeholder="ej. ONU, UNICEF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Logo (Imagen)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          form.setValue("logo", e.target.files?.[0])
                        }
                      />
                    </FormControl>
                    <FormDescription>Formatos: JPG, PNG.</FormDescription>
                  </FormItem>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Registrar Fundación
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
