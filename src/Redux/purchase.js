import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getPurchases: builder.query({
      query: () => "purchases?populate=*",
    }),
  }),
});

export const { useGetPurchasesQuery } = purchaseApi;
