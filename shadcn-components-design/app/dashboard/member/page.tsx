"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/const/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Lightbulb,
  LogOut,
  Loader2,
  Users,
  ArrowUpRight,
  Compass,
  Calendar,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Initiative {
  id: number;
  documentId: string;
  title: string;
  objective?: string;
  foundation?: { name: string; siglas: string };
  users_permissions_users?: { id: number }[];
  initiatives_categories?: { name: string }[];
  createdAt: string;
}

export default function MemberDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) {
      router.replace("/login");
      return;
    }
    if (user.role?.name !== "member") {
      router.replace("/dashboard");
      return;
    }

    fetch(
      `${API_URL}/api/iniciatives?filters[users_permissions_users][id][$eq]=${user.id}&populate[foundation][fields][0]=name&populate[foundation][fields][1]=siglas&populate[initiatives_categories][fields][0]=name&populate[users_permissions_users][fields][0]=id`,
      { headers: { Authorization: `Bearer ${jwt}` } },
    )
      .then((r) => r.json())
      .then((d) => setInitiatives(d.data || []))
      .catch(() => {})
      .finally(() => setDataLoading(false));
  }, [authLoading, user, jwt, router]);

  function handleLogout() {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Panel de miembro
            </p>
            <h1 className="text-3xl font-black tracking-tight">
              Hola, {user.username} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Estas son las iniciativas en las que participas
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/initiatives">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-2 hidden sm:flex"
              >
                <Compass className="h-4 w-4" />
                Explorar
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl gap-2 text-destructive hover:text-destructive border-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black text-primary">
              {initiatives.length}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Iniciativas unidas
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <p className="text-3xl font-black">
              {
                new Set(
                  initiatives.map((i) => i.foundation?.siglas).filter(Boolean),
                ).size
              }
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Fundaciones distintas
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 col-span-2 sm:col-span-1">
            <p className="text-3xl font-black">
              {
                new Set(
                  initiatives.flatMap(
                    (i) => i.initiatives_categories?.map((c) => c.name) ?? [],
                  ),
                ).size
              }
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Categorías
            </p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          <h2 className="font-black text-lg">Mis iniciativas</h2>
          {initiatives.length === 0 ? (
            <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
              <Lightbulb className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <div>
                <p className="font-bold">
                  Aún no te has unido a ninguna iniciativa
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Explora y únete a las que más te interesen
                </p>
              </div>
              <Link href="/initiatives">
                <Button className="rounded-xl gap-2 font-bold mt-2">
                  <Compass className="h-4 w-4" />
                  Explorar iniciativas
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {initiatives.map((init) => (
                <div
                  key={init.id}
                  className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 group hover:border-primary/30 transition-colors"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black truncate">{init.title}</h3>
                      {init.initiatives_categories?.map((cat) => (
                        <Badge
                          key={cat.name}
                          variant="secondary"
                          className="rounded-full text-[10px]"
                        >
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                    {init.objective && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {init.objective}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      {init.foundation && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {init.foundation.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {init.users_permissions_users?.length ?? 0} miembros
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(init.createdAt).toLocaleDateString("es-CO", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/initiatives/${init.documentId}`}
                    className="shrink-0"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl h-9 w-9 group-hover:bg-primary/10 group-hover:text-primary transition-colors"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
