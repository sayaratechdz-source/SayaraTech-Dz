import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getProducts, getProduct } from "../firebase/products";

// RTK Query مع Firestore بدل REST API
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Products"],
  endpoints: (builder) => ({

    // جلب كل المنتجات (مع فلتر اختياري)
    getProducts: builder.query({
      async queryFn(filter = {}) {
        try {
          // إذا كان filter نصاً (للتوافق مع الكود القديم) نتجاهله
          const filters = typeof filter === "string" ? {} : filter;
          const data = await getProducts(filters);
          // نحوّل البيانات لنفس شكل Strapi القديم حتى لا نكسر الكود
          return {
            data: {
              data: data.map((p) => ({
                id: p.id,
                attributes: {
                  productTitle: p.productTitle,
                  productPrice: p.productPrice,
                  discount: p.discount || 0,
                  productDescription: p.productDescription,
                  productRating: p.productRating || 0,
                  category: p.category,
                  stock: p.stock || 0,
                  minStock: p.minStock || 5,
                  status: p.status || "available",
                  brand: p.brand || "",
                  barcode: p.barcode || "",
                  vendeurId: p.vendeurId || "",
                  sku: p.sku || "",
                  createdAt: p.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                  // صورة واحدة من Firebase Storage
                  productimg: p.imageUrl
                    ? { data: [{ attributes: { url: p.imageUrl } }] }
                    : { data: [] },
                },
              })),
            },
          };
        } catch (e) {
          return { error: e.message };
        }
      },
      providesTags: ["Products"],
    }),

    // جلب منتج واحد
    getProduct: builder.query({
      async queryFn(id) {
        try {
          const p = await getProduct(id);
          if (!p) return { error: "Product not found" };
          return {
            data: {
              data: {
                id: p.id,
                attributes: {
                  productTitle: p.productTitle,
                  productPrice: p.productPrice,
                  discount: p.discount || 0,
                  productDescription: p.productDescription,
                  productRating: p.productRating || 0,
                  category: p.category,
                  stock: p.stock || 0,
                  status: p.status || "available",
                  brand: p.brand || "",
                  vendeurId: p.vendeurId || "",
                  sku: p.sku || "",
                  createdAt: p.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                  productimg: p.imageUrl
                    ? { data: [{ attributes: { url: p.imageUrl } }] }
                    : { data: [] },
                },
              },
            },
          };
        } catch (e) {
          return { error: e.message };
        }
      },
    }),

  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;
