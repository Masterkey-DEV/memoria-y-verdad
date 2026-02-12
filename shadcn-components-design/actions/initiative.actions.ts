import { Initiative, StrapiResponse } from "@/types/initiative";
import { apiURL } from "@/const/api";

export async function getIniciatives(): Promise<
  { success: true; data: Initiative[] } | { success: false; error: string }
> {
  try {
    const response = await fetch(`${apiURL}/api/iniciatives?populate=*`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error al obtener iniciativas");
    }

    const json: StrapiResponse<Initiative[]> = await response.json();

    return {
      success: true,
      data: json.data,
    };
  } catch {
    return {
      success: false,
      error: "Error de conexión",
    };
  }
}
