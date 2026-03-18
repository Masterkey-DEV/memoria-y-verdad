// types/foundation.ts
import type { StrapiImage } from "./shared";
import type { Initiative } from "./initiative";

export interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string | null;
  objective?: string | null;
  description?: string | null;
  location?: string | null;
  memberCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  image?: StrapiImage;
  // ⚠️ Strapi devuelve "iniciatives" (typo en el schema de Strapi, no se puede cambiar sin migración)
  iniciatives?: Initiative[];
  usuario?: {
    id: number;
    documentId: string;
    username: string;
    email: string;
  };
}