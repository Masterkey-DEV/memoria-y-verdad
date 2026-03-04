// @/types/product.ts

export interface ProductImage {
  url: string;
  alternativeText?: string;
}

export interface ProductCategory {
  name: string;
  slug?: string;
}

export interface Product {
  id: number;
  documentId: string; // Strapi v5 usa documentId
  name: string; //
  slug: string; //
  shortDescription: string; //
  description: string; //
  price: number; //
  stock: number; //
  featured: boolean; //
  images?: ProductImage[]; //
  product_categories?: ProductCategory[]; // Relación ManyToMany
}
