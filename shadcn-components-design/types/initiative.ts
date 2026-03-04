export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  formats: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Foundation {
  id: number;
  documentId: string;

  name: string;
  nit: string | null;
  siglas: string | null;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
}
export interface foundation {
  name: string;
}

export interface Initiative {
  id: number;
  documentId: string;
  title: string;
  foundation: foundation;
  objective: string;
  description: string;
  createdAt: string;
  category: Category; // Confirmado: campo 'category'
  images: {
    url: string;
    formats?: {
      medium?: { url: string };
      small?: { url: string };
    };
  }[];
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
