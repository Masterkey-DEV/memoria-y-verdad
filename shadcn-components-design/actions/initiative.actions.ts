// @/actions/initiative.actions.ts
import type { Initiative } from "@/types/initiative";
import { buildQuery, fetchStrapi } from "@/lib/strapi-client";

type InitiativeCategory = { id: number; name: string };

export async function getInitiativeCategories() {
  try {
    const query = buildQuery({
      "fields[0]": "name",
      "fields[1]": "id",
    });

    const json = await fetchStrapi<InitiativeCategory[]>(
      "/api/initiatives-categories",
      {
        query,
        next: { revalidate: 3600 },
      },
    );

    return { success: true, data: json.data };
  } catch (error) {
    console.error("Error al obtener categorías de iniciativas", error);
    return { success: false, data: [] };
  }
}

export async function getInitiatives(categoryName?: string | null) {
  try {
    const query = buildQuery({
      populate: "*",
      ...(categoryName && categoryName !== "all"
        ? { "filters[initiatives_categories][name][$eq]": categoryName }
        : {}),
    });

    const json = await fetchStrapi<Initiative[]>("/api/iniciatives", {
      query,
      cache: "no-store",
    });

    return { success: true, data: json.data };
  } catch (error) {
    console.error("Error al obtener iniciativas", error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar las iniciativas",
    };
  }
}

// Compatibilidad temporal para evitar romper imports existentes
export const getIniciatives = getInitiatives;

export async function getInitiativeByDocumentId(documentId: string) {
  try {
    const query = buildQuery({ populate: "*" });

    const json = await fetchStrapi<Initiative>(`/api/iniciatives/${documentId}`, {
      query,
      cache: "no-store",
    });

    return { success: true, data: json.data };
  } catch (error) {
    console.error("Error al obtener la iniciativa", error);
    return {
      success: false,
      data: null,
      error: "No se encontró la iniciativa",
    };
  }
}
