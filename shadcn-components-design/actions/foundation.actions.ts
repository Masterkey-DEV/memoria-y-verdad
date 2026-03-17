// @/actions/foundation.actions.ts
import { API_URL } from "@/const/api";

export async function getFoundations() {
  try {
    const res = await fetch(`${API_URL}/api/foundations?populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener fundaciones");

    const json = await res.json();

    // 👇 Agrega esto temporalmente
    console.log("FOUNDATIONS DATA:", JSON.stringify(json.data?.[0], null, 2));

    return {
      success: true,
      data: json.data,
    };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function getFoundationBySiglas(siglas: string) {
  try {
    // Decodificar por si viene con %20 u otros caracteres especiales
    const decodedSiglas = decodeURIComponent(siglas);

    const params = new URLSearchParams();

    // Populate profundo: iniciativas con todos sus campos
    params.append("populate[iniciatives][fields][0]", "title");
    params.append("populate[iniciatives][fields][1]", "objective");
    params.append("populate[iniciatives][fields][2]", "description");
    // Populate imagen de la fundación
    params.append("populate[image][fields][0]", "url");
    params.append("populate[image][fields][1]", "alternativeText");
    // Filtro por siglas
    params.append("filters[siglas][$eq]", decodedSiglas);

    const res = await fetch(`${API_URL}/api/foundations?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al obtener la fundación");

    const json = await res.json();

    // Log para debuggear - puedes quitarlo después
    console.log(
      "Foundation API response:",
      JSON.stringify(json.data?.[0], null, 2),
    );

    return {
      success: true,
      data: json.data?.[0] ?? null,
    };
  } catch (error) {
    console.error("Fetch Foundation Error:", error);
    return { success: false, data: null };
  }
}
