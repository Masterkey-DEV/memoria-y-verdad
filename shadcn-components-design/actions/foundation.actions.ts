// @/actions/foundation.actions.ts
import { buildQuery, fetchStrapi } from "@/lib/strapi-client";

export async function getFoundations() {
  try {
    const query = buildQuery({ populate: "*" });
    const json = await fetchStrapi<unknown[]>("/api/foundations", {
      query,
      cache: "no-store",
    });

    return {
      success: true,
      data: json.data,
    };
  } catch (error) {
    console.error("Error al obtener fundaciones", error);
    return { success: false, data: [] };
  }
}

export async function getFoundationBySiglas(siglas: string) {
  try {
    const decodedSiglas = decodeURIComponent(siglas);
    const query = buildQuery({
      "populate[iniciatives][fields][0]": "title",
      "populate[iniciatives][fields][1]": "objective",
      "populate[iniciatives][fields][2]": "description",
      "populate[image][fields][0]": "url",
      "populate[image][fields][1]": "alternativeText",
      "filters[siglas][$eq]": decodedSiglas,
    });

    const json = await fetchStrapi<unknown[]>("/api/foundations", {
      query,
      cache: "no-store",
    });

    return {
      success: true,
      data: json.data?.[0] ?? null,
    };
  } catch (error) {
    console.error("Error al obtener la fundación", error);
    return { success: false, data: null };
  }
}
