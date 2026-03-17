import { Product } from "@/types/product";
import { API_URL } from "@/const/api";

/**
 * Obtiene las categorías de productos para los filtros locales
 */
export async function getProductCategories() {
  try {
    // Usamos fields para no traer datos innecesarios y optimizar la velocidad
    const query = new URLSearchParams({
      "fields[0]": "name",
      "fields[1]": "slug",
    });

    const res = await fetch(
      `${API_URL}/api/product-categories?${query.toString()}`,
      {
        next: { revalidate: 3600 }, // Cache por 1 hora
      },
    );

    if (!res.ok) throw new Error("Error al obtener categorías");

    const json = await res.json();

    // Mapeo compatible con Strapi v4 (attributes) y v5 (directo)
    const data = json.data.map((item: any) => ({
      id: item.id,
      name: item.name || item.attributes?.name,
      slug: item.slug || item.attributes?.slug,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar las categorías",
    };
  }
}

/**
 * Obtiene productos filtrados por categoría
 */
export async function getProducts(categoryName?: string | null) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");

    // Ajuste: Si usas slugs en tus botones, es mejor filtrar por [$eq] de slug
    if (categoryName && categoryName !== "all" && categoryName !== "Todos") {
      params.append("filters[product_categories][name][$eq]", categoryName);
    }

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener los productos");

    const json = await res.json();

    // En Strapi v4/v5 los datos vienen en json.data
    // Si necesitas limpiar los atributos, puedes mapearlos aquí
    return { success: true, data: json.data as Product[] };
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar los productos",
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const params = new URLSearchParams();
    params.append("populate", "*");
    params.append("filters[slug][$eq]", slug);

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener el producto");

    const json = await res.json();

    return {
      success: true,
      data:
        json.data && json.data.length > 0 ? (json.data[0] as Product) : null,
    };
  } catch (error) {
    console.error("Fetch Product Error:", error);
    return { success: false, data: null, error: "No se encontró el producto" };
  }
}
