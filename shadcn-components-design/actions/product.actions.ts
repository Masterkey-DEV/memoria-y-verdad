import { buildQuery, fetchStrapi } from "@/lib/strapi-client";
import { Product } from "@/types/product";

type ProductCategory = {
  id: number;
  name?: string;
  slug?: string;
  attributes?: {
    name?: string;
    slug?: string;
  };
};

type ProductCategoryOption = {
  id: number;
  name: string;
  slug: string;
};

/**
 * Obtiene las categorías de productos para los filtros locales
 */
export async function getProductCategories() {
  try {
    const query = buildQuery({
      "fields[0]": "name",
      "fields[1]": "slug",
    });

    const json = await fetchStrapi<ProductCategory[]>("/api/product-categories", {
      query,
      next: { revalidate: 3600 },
    });

    const data: ProductCategoryOption[] = json.data.map((item) => ({
      id: item.id,
      name: item.name || item.attributes?.name || "",
      slug: item.slug || item.attributes?.slug || "",
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener categorías de productos", error);
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
    const query = buildQuery({
      populate: "*",
      ...(categoryName && categoryName !== "all" && categoryName !== "Todos"
        ? { "filters[product_categories][name][$eq]": categoryName }
        : {}),
    });

    const json = await fetchStrapi<Product[]>("/api/products", {
      query,
      cache: "no-store",
    });

    return { success: true, data: json.data };
  } catch (error) {
    console.error("Error al obtener productos", error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar los productos",
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const query = buildQuery({
      populate: "*",
      "filters[slug][$eq]": slug,
    });

    const json = await fetchStrapi<Product[]>("/api/products", {
      query,
      cache: "no-store",
    });

    return {
      success: true,
      data: json.data.length > 0 ? json.data[0] : null,
    };
  } catch (error) {
    console.error("Error al obtener producto", error);
    return { success: false, data: null, error: "No se encontró el producto" };
  }
}
