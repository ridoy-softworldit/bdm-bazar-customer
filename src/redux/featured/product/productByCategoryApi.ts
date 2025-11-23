import { baseApi } from "@/redux/api/baseApi";

export interface ProductResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Record<string, unknown>[];
}

// Note: useGetAllProductsQuery is imported from productApi.ts to avoid duplicates

export const productByCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByCategory: builder.query<ProductResponse, { categoryId?: string; mainCategory?: string }>({
      query: () => {
        // For now, just get all products since the API doesn't support category filtering yet
        // We'll filter on the client side
        return {
          url: "/product",
          method: "GET",
        };
      },
      transformResponse: (response: ProductResponse) => {
        return response;
      },
    }),
  }),
});

export const { useGetProductsByCategoryQuery } = productByCategoryApi;