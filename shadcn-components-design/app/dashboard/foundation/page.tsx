"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/const/api";
import { useAuth } from "@/context/AuthContext";
import {
  Lightbulb,
  Package,
  LogOut,
  Loader2,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Tab = "initiatives" | "products";

interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string;
}

interface Initiative {
  id: number;
  documentId: string;
  title: string;
  objective?: string;
  users_permissions_users?: { id: number }[];
  initiatives_categories?: { id: number; name: string }[];
}

interface Product {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription?: string;
  price?: number;
  stock?: number;
  featured?: boolean;
  images?: { url: string }[];
}

interface Category {
  id: number;
  name: string;
}

const inputCls =
  "w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">{label}</label>
      {children}
    </div>
  );
}

const EMPTY_INIT = {
  title: "",
  objective: "",
  description: "",
  categories: [] as number[],
};

const EMPTY_PROD = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  stock: "",
  featured: false,
};

function autoSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function FoundationDashboard() {
  const { user, jwt, loading: authLoading, logout } = useAuth();
  const [foundation, setFoundation] = useState<Foundation | null>(null);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<Tab>("initiatives");
  const [dataLoading, setDataLoading] = useState(true);

  const [initModal, setInitModal] = useState<"closed" | "create" | "edit">(
    "closed",
  );
  const [editInit, setEditInit] = useState<Initiative | null>(null);
  const [initForm, setInitForm] = useState(EMPTY_INIT);
  const [initImage, setInitImage] = useState<File | null>(null);

  const [prodModal, setProdModal] = useState<"closed" | "create" | "edit">(
    "closed",
  );
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState(EMPTY_PROD);
  const [prodImage, setProdImage] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) {
      router.replace("/login");
      return;
    }
    if (user.role?.name.toLocaleLowerCase() !== "foundation") {
      router.replace("/dashboard");
      return;
    }

    async function load() {
      try {
        const [foundRes, catRes] = await Promise.all([
          fetch(
            `${API_URL}/api/foundations?filters[users_permissions_user][id][$eq]=${user!.id}`,
            { headers: { Authorization: `Bearer ${jwt}` } },
          ),
          fetch(
            `${API_URL}/api/initiatives-categories?fields[0]=name&fields[1]=id`,
            { headers: { Authorization: `Bearer ${jwt}` } },
          ),
        ]);
        
        const foundData = await foundRes.json();
        const catData = await catRes.json();
        
        const found: Foundation | null = foundData.data?.[0] ?? null;
        setFoundation(found);
        setCategories(
          catData.data?.map((c: any) => ({ id: c.id, name: c.name })) ?? [],
        );

        if (found) {
          await Promise.all([
            fetchInitiatives(found.documentId),
            fetchProducts(),
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setDataLoading(false);
      }
    }
    load();
  }, [authLoading, user, jwt, router]);

  async function fetchInitiatives(foundDocId: string) {
    if (!jwt) return;
    // Corregido a /api/iniciatives
    const res = await fetch(
      `${API_URL}/api/iniciatives?filters[foundation][documentId][$eq]=${foundDocId}&populate[users_permissions_users][fields][0]=id&populate[initiatives_categories][fields][0]=name`,
      { headers: { Authorization: `Bearer ${jwt}` } },
    );
    const data = await res.json();
    setInitiatives(data.data || []);
  }

  async function fetchProducts() {
    if (!jwt) return;
    const res = await fetch(`${API_URL}/api/products?populate=images`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = await res.json();
    setProducts(data.data || []);
  }

  function handleLogout() {
    logout();
    toast({ title: "Sesión cerrada" });
    router.push("/");
  }

  // —— INITIATIVES ——
  function openCreateInit() {
    setInitForm(EMPTY_INIT);
    setInitImage(null);
    setEditInit(null);
    setInitModal("create");
  }

  function openEditInit(i: Initiative) {
    setInitForm({
      title: i.title,
      objective: i.objective ?? "",
      description: "",
      categories: i.initiatives_categories?.map((c: any) => c.id) ?? [],
    });
    setInitImage(null);
    setEditInit(i);
    setInitModal("edit");
  }

  async function saveInit() {
    if (!jwt || !foundation) return;
    setSaving(true);
    try {
      let imageId: number | undefined;
      if (initImage) {
        const fd = new FormData();
        fd.append("files", initImage);
        const up = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${jwt}` },
          body: fd,
        });
        if (up.ok) {
          const u = await up.json();
          imageId = u[0]?.id;
        }
      }

      const payload = {
        title: initForm.title,
        objective: initForm.objective,
        description: initForm.description,
        foundation: foundation.id,
        ...(initForm.categories.length
          ? { initiatives_categories: initForm.categories }
          : {}),
        ...(imageId ? { images: [imageId] } : {}),
      };

      if (initModal === "create") {
        // Corregido a /api/iniciatives
        const res = await fetch(`${API_URL}/api/iniciatives`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: payload }),
        });
        if (!res.ok) throw new Error("Error al crear la iniciativa");
        toast({ title: "Iniciativa creada ✓" });
      } else if (editInit) {
        // Corregido a /api/iniciatives
        const res = await fetch(
          `${API_URL}/api/iniciatives/${editInit.documentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ data: payload }),
          },
        );
        if (!res.ok) throw new Error("Error al actualizar la iniciativa");
        toast({ title: "Iniciativa actualizada ✓" });
      }
      await fetchInitiatives(foundation.documentId);
      setInitModal("closed");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteInit(docId: string) {
    if (!jwt || !foundation) return;
    setDeleting(docId);
    try {
      // Corregido a /api/iniciatives
      const res = await fetch(`${API_URL}/api/iniciatives/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error();
      toast({ title: "Iniciativa eliminada" });
      await fetchInitiatives(foundation.documentId);
    } catch {
      toast({ variant: "destructive", title: "Error al eliminar" });
    } finally {
      setDeleting(null);
    }
  }

  // —— PRODUCTS ——
  function openCreateProd() {
    setProdForm(EMPTY_PROD);
    setProdImage(null);
    setEditProd(null);
    setProdModal("create");
  }

  function openEditProd(p: Product) {
    setProdForm({
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription ?? "",
      description: "",
      price: p.price?.toString() ?? "",
      stock: p.stock?.toString() ?? "",
      featured: p.featured ?? false,
    });
    setProdImage(null);
    setEditProd(p);
    setProdModal("edit");
  }

  async function saveProd() {
    if (!jwt) return;
    setSaving(true);
    try {
      let imageId: number | undefined;
      if (prodImage) {
        const fd = new FormData();
        fd.append("files", prodImage);
        const up = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${jwt}` },
          body: fd,
        });
        if (up.ok) {
          const u = await up.json();
          imageId = u[0]?.id;
        }
      }
      const payload = {
        name: prodForm.name,
        slug: prodForm.slug || autoSlug(prodForm.name),
        shortDescription: prodForm.shortDescription,
        description: prodForm.description,
        price: parseFloat(prodForm.price) || 0,
        stock: parseInt(prodForm.stock) || 0,
        featured: prodForm.featured,
        ...(imageId ? { images: [imageId] } : {}),
      };

      if (prodModal === "create") {
        const res = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ data: payload }),
        });
        if (!res.ok) throw new Error("Error al crear producto");
        toast({ title: "Producto creado ✓" });
      } else if (editProd) {
        const res = await fetch(
          `${API_URL}/api/products/${editProd.documentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({ data: payload }),
          },
        );
        if (!res.ok) throw new Error("Error al actualizar producto");
        toast({ title: "Producto actualizado ✓" });
      }
      await fetchProducts();
      setProdModal("closed");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteProd(docId: string) {
    if (!jwt) return;
    setDeleting(docId);
    try {
      const res = await fetch(`${API_URL}/api/products/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error();
      toast({ title: "Producto eliminado" });
      await fetchProducts();
    } catch {
      toast({ variant: "destructive", title: "Error al eliminar" });
    } finally {
      setDeleting(null);
    }
  }

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const totalMembers = initiatives.reduce(
    (a, i) => a + (i.users_permissions_users?.length ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-muted/30">
        {/* Aquí iría el resto del JSX de tu dashboard */}
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Panel de Fundación: {foundation?.name}</h1>
            {/* Renderizado de tabs y modales... */}
        </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Panel de fundación
            </p>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">
                {foundation?.name ?? user.username}
              </h1>
              {foundation && (
                <Badge
                  variant="outline"
                  className="rounded-full text-sm font-black"
                >
                  {foundation.siglas}
                </Badge>
              )}
            </div>
            {foundation && (
              <Link
                href={`/foundations/${foundation.siglas}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                <Eye className="h-3 w-3" />
                Ver perfil público
              </Link>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-xl gap-2 text-destructive hover:text-destructive border-destructive/20 shrink-0"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Lightbulb,
              value: initiatives.length,
              label: "Iniciativas",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Users,
              value: totalMembers,
              label: "Miembros",
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              icon: Package,
              value: products.length,
              label: "Productos",
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              icon: Building2,
              value: foundation ? 1 : 0,
              label: "Fundación",
              color: "text-primary",
              bg: "bg-primary/10",
            },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-5 space-y-3"
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  bg,
                )}
              >
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-3xl font-black">{value}</p>
                <p className="text-xs text-muted-foreground font-medium">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-2xl p-1.5 w-fit">
          {(
            [
              {
                id: "initiatives" as Tab,
                label: "Iniciativas",
                icon: Lightbulb,
              },
              { id: "products" as Tab, label: "Productos", icon: Package },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                tab === id
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* INITIATIVES */}
        {tab === "initiatives" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis iniciativas</h2>
              <Button
                onClick={openCreateInit}
                className="rounded-xl gap-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Nueva iniciativa
              </Button>
            </div>
            {initiatives.length === 0 ? (
              <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
                <Lightbulb className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                <div>
                  <p className="font-bold">Sin iniciativas</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Crea tu primera iniciativa y comienza a construir comunidad.
                  </p>
                </div>
                <Button
                  onClick={openCreateInit}
                  className="rounded-xl gap-2 font-bold mt-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear iniciativa
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {initiatives.map((init) => (
                  <div
                    key={init.id}
                    className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black">{init.title}</h3>
                        {init.initiatives_categories?.map((c) => (
                          <Badge
                            key={c.name}
                            variant="secondary"
                            className="rounded-full text-[10px]"
                          >
                            {c.name}
                          </Badge>
                        ))}
                      </div>
                      {init.objective && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {init.objective}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {init.users_permissions_users?.length ?? 0} miembros
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/initiatives/${init.documentId}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl h-9 w-9"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-9 w-9"
                        onClick={() => openEditInit(init)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-9 w-9 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                        onClick={() => deleteInit(init.documentId)}
                        disabled={deleting === init.documentId}
                      >
                        {deleting === init.documentId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">Mis productos</h2>
              <Button
                onClick={openCreateProd}
                className="rounded-xl gap-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Nuevo producto
              </Button>
            </div>
            {products.length === 0 ? (
              <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center space-y-4">
                <Package className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                <div>
                  <p className="font-bold">Sin productos</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Agrega productos vinculados a tu fundación.
                  </p>
                </div>
                <Button
                  onClick={openCreateProd}
                  className="rounded-xl gap-2 font-bold mt-2"
                >
                  <Plus className="h-4 w-4" />
                  Crear producto
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-14 w-14 rounded-xl bg-muted overflow-hidden shrink-0">
                        {prod.images?.[0] ? (
                          <img
                            src={`${API_URL}${prod.images[0].url}`}
                            alt={prod.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black truncate">{prod.name}</h3>
                          {prod.featured && (
                            <Badge className="rounded-full text-[10px] px-2">
                              Destacado
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {prod.shortDescription}
                        </p>
                        <p className="text-xs font-bold text-primary">
                          ${prod.price?.toLocaleString("es-CO")} · {prod.stock}{" "}
                          en stock
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Link href={`/products/${prod.slug}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-xl h-9 w-9"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-9 w-9"
                        onClick={() => openEditProd(prod)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-9 w-9 text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                        onClick={() => deleteProd(prod.documentId)}
                        disabled={deleting === prod.documentId}
                      >
                        {deleting === prod.documentId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL INICIATIVA */}
      {initModal !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h2 className="font-black text-xl">
                {initModal === "create"
                  ? "Nueva iniciativa"
                  : "Editar iniciativa"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setInitModal("closed")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <Field label="Título *">
                <input
                  value={initForm.title}
                  onChange={(e) =>
                    setInitForm({ ...initForm, title: e.target.value })
                  }
                  placeholder="Nombre de la iniciativa"
                  className={inputCls}
                />
              </Field>
              <Field label="Objetivo">
                <input
                  value={initForm.objective}
                  onChange={(e) =>
                    setInitForm({ ...initForm, objective: e.target.value })
                  }
                  placeholder="¿Qué busca lograr esta iniciativa?"
                  className={inputCls}
                />
              </Field>
              <Field label="Descripción">
                <textarea
                  value={initForm.description}
                  onChange={(e) =>
                    setInitForm({ ...initForm, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe la iniciativa en detalle..."
                  className={cn(inputCls, "resize-none")}
                />
              </Field>
              {categories.length > 0 && (
                <Field label="Categorías">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const selected = initForm.categories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setInitForm({
                              ...initForm,
                              categories: selected
                                ? initForm.categories.filter(
                                    (c) => c !== cat.id,
                                  )
                                : [...initForm.categories, cat.id],
                            })
                          }
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                            selected
                              ? "bg-primary text-white border-primary"
                              : "border-border text-muted-foreground hover:border-primary/40",
                          )}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              )}
              <Field label="Imagen">
                <label
                  className={cn(
                    "flex items-center gap-3 cursor-pointer border border-dashed rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group",
                    initImage
                      ? "border-primary/40 bg-primary/5"
                      : "border-input",
                  )}
                >
                  {initImage ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  )}
                  <span className="text-sm text-muted-foreground truncate">
                    {initImage ? initImage.name : "Subir imagen"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setInitImage(e.target.files?.[0] || null)}
                  />
                </label>
              </Field>
              <div className="flex gap-3 pt-2 border-t border-border mt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setInitModal("closed")}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 rounded-xl font-bold"
                  onClick={saveInit}
                  disabled={saving || !initForm.title}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : initModal === "create" ? (
                    "Crear iniciativa"
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTO */}
      {prodModal !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h2 className="font-black text-xl">
                {prodModal === "create" ? "Nuevo producto" : "Editar producto"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setProdModal("closed")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <Field label="Nombre *">
                <input
                  value={prodForm.name}
                  onChange={(e) =>
                    setProdForm({
                      ...prodForm,
                      name: e.target.value,
                      slug: autoSlug(e.target.value),
                    })
                  }
                  placeholder="Producto artesanal"
                  className={inputCls}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  value={prodForm.slug}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, slug: e.target.value })
                  }
                  placeholder="producto-artesanal"
                  className={inputCls}
                />
              </Field>
              <Field label="Descripción corta">
                <input
                  value={prodForm.shortDescription}
                  onChange={(e) =>
                    setProdForm({
                      ...prodForm,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="Breve descripción visible en el catálogo"
                  className={inputCls}
                />
              </Field>
              <Field label="Descripción completa">
                <textarea
                  value={prodForm.description}
                  onChange={(e) =>
                    setProdForm({ ...prodForm, description: e.target.value })
                  }
                  rows={3}
                  placeholder="Describe tu producto en detalle..."
                  className={cn(inputCls, "resize-none")}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio (COP)">
                  <input
                    type="number"
                    value={prodForm.price}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, price: e.target.value })
                    }
                    placeholder="25000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Stock">
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, stock: e.target.value })
                    }
                    placeholder="10"
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Imagen">
                <label
                  className={cn(
                    "flex items-center gap-3 cursor-pointer border border-dashed rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-all group",
                    prodImage
                      ? "border-primary/40 bg-primary/5"
                      : "border-input",
                  )}
                >
                  {prodImage ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  )}
                  <span className="text-sm text-muted-foreground truncate">
                    {prodImage ? prodImage.name : "Subir imagen del producto"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setProdImage(e.target.files?.[0] || null)}
                  />
                </label>
              </Field>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() =>
                    setProdForm({ ...prodForm, featured: !prodForm.featured })
                  }
                  className={cn(
                    "h-6 w-11 rounded-full transition-colors relative",
                    prodForm.featured ? "bg-primary" : "bg-muted-foreground/20",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      prodForm.featured ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </div>
                <span className="text-sm font-semibold">
                  Marcar como destacado
                </span>
              </label>
              <div className="flex gap-3 pt-2 border-t border-border mt-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setProdModal("closed")}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 rounded-xl font-bold"
                  onClick={saveProd}
                  disabled={saving || !prodForm.name}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : prodModal === "create" ? (
                    "Crear producto"
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
