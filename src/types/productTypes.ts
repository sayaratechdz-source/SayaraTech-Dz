// src/types/productTypes.ts
export interface ProductImage {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}

export interface ProductAttributes {
  productTitle: string;
  productPrice: number;
  productRating?: number;
  productDescription?: string;
  productimg?: {
    data: ProductImage[];
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface Product {
  id: number;
  attributes: ProductAttributes;
}