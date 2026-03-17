"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, Eye, Lightbulb, Package, Plus } from "lucide-react";

import { API_URL } from "@/const/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import { StatsGrid } from "@/components/dashboard/foundation/Statsgrid";
import { TabBar } from "@/components/dashboard/foundation/Tabbar";
import { InitiativeCard } from "@/components/dashboard/foundation/InitiativeCard";
import { ProductCard } from "@/components/dashboard/foundation/ProductCard";
import { EmptyState } from "@/components/dashboard/foundation/EmptyState";
import { InitiativeModal } from "@/components/dashboard/foundation/InititativeModal";
import { ProductModal } from "@/components/dashboard/foundation/ProductModal";

import { useInitiatives, useProducts, useCategories } from "@/hooks/dashboard";

import type { Foundation, Tab } from "@/types/dashboard";

export default function FoundationDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [foundation, setFoundation] = useState<Foundation | null>(null);
  const [tab, setTab] = useState<Tab>("initiatives");
  const [dataLoading, setDataLoading] = useState(true);

  const initiatives = useInitiatives(jwt);
  const products = useProducts(jwt);
  const { categories, fetch: fetchCategories } = useCategories(jwt);

  // Refs para evitar dependencias cambiantes en initDashboard
  const initiativesFetchRef = useRef(initiatives.fetch);
  const productsFetchRef = useRef(products.fetch);
  const fetchCategoriesRef = useRef(fetchCategories);

  useEffect(() => { initiativesFetchRef.current = initiatives.fetch; }, [initiatives.fetch]);
  useEffect(() => { productsFetchRef.current = products.fetch; }, [products.fetch]);
  useEffect(() => { fetchCategoriesRef.current = fetchCategories; }, [fetchCategories]);

  // ✅ Filtra la fundación por usuario (campo "usuario" en foundation)
  const fetchFoundation = useCallback(async () => {
    if (!user || !jwt) return null;
    try {
      // ✅ Strapi v5: filtrar por relación "usuario" no funciona directamente.
      // En cambio, populamos la relación inversa "foundation" desde el usuario autenticado.
      const res = await fetch(
        `${API_URL}/api/users/me?populate[foundation][fields][0]=id&populate[foundation][fields][1]=documentId&populate[foundation][fields][2]=name&populate[foundation][fields][3]=siglas`,
        { headers: { Authorization: `Bearer ${jwt}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // json.foundation es el objeto directo (no array) porque es oneToOne
      return json.foundation ?? null;
    } catch (err) {
      console.error("Error loading foundation:", err);
      toast({ variant: "destructive", title: "Error al cargar fundación" });
      return null;
    }
  }, [user, jwt, toast]);

  const initDashboard = useCallback(async () => {
    try {
      setDataLoading(true);
      await fetchCategoriesRef.current();

      const found = await fetchFoundation();
      if (!found) {
        toast({ variant: "destructive", title: "Sin fundación", description: "Tu usuario no tiene una fundación asociada." });
        return;
      }

      setFoundation(found);

      await Promise.all([
        // ✅ Iniciativas: filtra por foundation.documentId
        initiativesFetchRef.current(found.documentId),
        // ✅ Productos: filtra por users_permissions_user (userId numérico)
        productsFetchRef.current(user!.id),
      ]);
    } catch (err) {
      console.error("Dashboard error:", err);
      toast({ variant: "destructive", title: "Error al cargar el panel" });
    } finally {
      setDataLoading(false);
    }
  }, [fetchFoundation, user, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) { setDataLoading(false); router.replace("/login"); return; }
    if (user.role?.name?.toLowerCase() !== "foundation") { setDataLoading(false); router.replace("/dashboard"); return; }
    initDashboard();
  }, [authLoading, user, jwt, router, initDashboard]);

  const handleLogout = useCallback(() => {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }, [logout, toast, router]);

  if (authLoading || dataLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Panel de fundación</p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{foundation?.name ?? user.username}</h1>
              {foundation && <Badge variant="outline" className="rounded-full text-sm font-black">{foundation.siglas}</Badge>}
            </div>
            {foundation && (
              <Link href={`/foundations/${foundation.siglas}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1">
                <Eye className="h-3 w-3" />Ver perfil público
              </Link>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl gap-2 text-destructive border-destructive/20">
            <LogOut className="h-4 w-4" />Salir
          </Button>
        </div>

        {/* STATS */}
        <StatsGrid foundation={foundation} initiatives={initiatives.initiatives} products={products.products} />

        {/* TABS */}
        <TabBar active={tab} onChange={setTab} />

        {/* INITIATIVES */}
        {tab === "initiatives" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis iniciativas</h2>
              <Button onClick={initiatives.openCreate} className="rounded-xl gap-2 font-bold">
                <Plus className="h-4 w-4" />Nueva iniciativa
              </Button>
            </div>
            {initiatives.initiatives.length === 0 ? (
              <EmptyState icon={Lightbulb} title="Sin iniciativas" description="Crea tu primera iniciativa." actionLabel="Crear iniciativa" onAction={initiatives.openCreate} />
            ) : (
              <div className="grid gap-3">
                {initiatives.initiatives.map((init) => (
                  <InitiativeCard
                    key={init.id}
                    initiative={init}
                    deleting={initiatives.deleting === init.documentId}
                    onEdit={() => initiatives.openEdit(init)}
                    // ✅ remove necesita foundDocId para refetch
                    onDelete={() => foundation && initiatives.remove(init.documentId, foundation.documentId)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis productos</h2>
              <Button onClick={products.openCreate} className="rounded-xl gap-2 font-bold">
                <Plus className="h-4 w-4" />Nuevo producto
              </Button>
            </div>
            {products.products.length === 0 ? (
              <EmptyState icon={Package} title="Sin productos" description="Agrega productos vinculados a tu cuenta." actionLabel="Crear producto" onAction={products.openCreate} />
            ) : (
              <div className="grid gap-3">
                {products.products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    deleting={products.deleting === prod.documentId}
                    onEdit={() => products.openEdit(prod)}
                    // ✅ remove necesita userId para refetch
                    onDelete={() => products.remove(prod.documentId, user.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* MODAL INICIATIVA */}
      {initiatives.modal !== "closed" && (
        <InitiativeModal
          mode={initiatives.modal}
          form={initiatives.form}
          categories={categories}
          image={initiatives.image}
          saving={initiatives.saving}
          editTarget={initiatives.editTarget}
          onFormChange={initiatives.setForm}
          onImageChange={initiatives.setImage}
          // ✅ save necesita foundDocId
          onSave={() => foundation && initiatives.save(foundation.documentId)}
          onClose={initiatives.close}
        />
      )}

      {/* MODAL PRODUCTO */}
      {products.modal !== "closed" && (
        <ProductModal
          mode={products.modal}
          form={products.form}
          image={products.image}
          saving={products.saving}
          onFormChange={products.setForm}
          onImageChange={products.setImage}
          // ✅ save necesita userId (products usa users_permissions_user)
          onSave={() => products.save(user.id)}
          onClose={products.close}
        />
      )}
    </div>
  );
}