import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "https://backend-stdz-production.up.railway.app";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${STRAPI_URL}/api/`,
    // لا توكن للقراءة العامة — Strapi Public role مفعّل
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({

    // جلب كل المنتجات
    getProducts: builder.query({
      query: (params = "products?populate=*") => {
        if (typeof params === "string") return params;
        const { category, search } = params;
        let qs = "products?populate=*";
        if (category && category !== "all") {
          qs += `&filters[category][$eq]=${encodeURIComponent(category)}`;
        }
        if (search) {
          qs += `&filters[productTitle][$containsi]=${encodeURIComponent(search)}`;
        }
        return qs;
      },
      providesTags: ["Products"],
    }),

    // جلب منتج واحد
    getProduct: builder.query({
      query: (id) => `products/${id}?populate=*`,
    }),

  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;
