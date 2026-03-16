import { buildQuery, fetchStrapi } from "@/lib/strapi-client";

export async function getStories() {
  try {
    const query = buildQuery({ populate: "*" });
    const json = await fetchStrapi<unknown[]>("/api/iniciatives", {
      query,
      cache: "no-store",
    });

    return { success: true, data: json.data };
  } catch (error) {
    console.error("Error al obtener historias", error);
    return {
      success: false,
      data: [],
      error: "No se pudieron cargar las historias",
    };
  }
}
