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
  nombre: string;
  nit: string | null;
  siglas: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Initiative {
  id: number;
  documentId: string;

  titulo: string;
  objetivo: string;
  descripcion: string;

  createdAt: string;
  updatedAt: string;
  publishedAt: string;

  foundation: Foundation;

  imagenes: StrapiImage[];
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
