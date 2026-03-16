import type { Initiative, StrapiImage } from "@/types/initiative";

export interface Foundation {
  id: number;
  documentId: string;
  name: string;
  siglas: string | null;
  objective?: string | null;
  image?: StrapiImage;
  iniciatives?: Initiative[];
  initiatives?: Initiative[];
}
