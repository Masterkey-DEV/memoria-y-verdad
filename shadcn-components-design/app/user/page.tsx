"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  foundationName: z.string().min(2, "El nombre de la fundación es obligatorio"),
  siglas: z.string().min(2, "Las siglas son obligatorias"),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
    setLoading(true);
    try {
      // 1. Registro del Usuario en Strapi
      const regRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        },
      );

      const regData = await regRes.json();
      if (!regRes.ok)
        throw new Error(regData.error.message || "Error al registrar usuario");

      const jwt = regData.jwt;
      const userId = regData.user.id;

      // 2. Creación de la Fundación vinculada (Basado en tu esquema de imagen_12c85c.png)
      const foundRes = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/foundations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            data: {
              name: values.foundationName,
              siglas: values.siglas,
              users_permissions_user: userId, // Relación OneToOne que definiste
            },
          }),
        },
      );

      if (!foundRes.ok)
        throw new Error(
          "Usuario creado, pero hubo un error al crear la fundación",
        );

      toast({
        title: "¡Éxito!",
        description: "Cuenta y fundación creadas correctamente.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos y los de tu fundación para comenzar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="juanperez" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="admin@fundacion.org"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Datos de la Fundación
                  </span>
                </div>
              </div>

              <FormField
                control={form.control}
                name="foundationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Oficial</FormLabel>
                    <FormControl>
                      <Input placeholder="Fundación Esperanza" {...field} />
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
                    <FormLabel>Siglas</FormLabel>
                    <FormControl>
                      <Input placeholder="FE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Procesando..." : "Registrar ahora"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
