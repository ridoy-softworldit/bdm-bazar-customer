import { baseApi } from "@/redux/api/baseApi";
import { TProduct, TProductResponse } from "@/types/product/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({
        url: "/product",
        method: "GET",
      }),
    }),

    searchProducts: builder.query<TProductResponse, string>({
      query: (q) => ({
        url: "/product/search",
        method: "GET",
        params: { q },
      }),
    }),

    getSingleProduct: builder.query<TProduct, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
    }),

    getProductsByCategoryAndTag: builder.query<
      TProduct[],
      { category?: string; tag?: string }
    >({
      query: ({ category, tag }) => ({
        url: "/product/products/by",
        method: "GET",
        params: { category, tag },
      }),
    }),
    createProduct: builder.mutation<TProduct, FormData>({
      query: (formData) => ({
        url: "/product/create-product",
        method: "POST",
        body: formData,
      }),
    }),

    updateProduct: builder.mutation<TProduct, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/product/update-product/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    getProductsByAuthor: builder.query<TProductResponse, string>({
      query: (authorId) => ({
        url: `/product/by-author/${authorId}`,
        method: "GET",
      }),
    }),

    getRecentlySoldProducts: builder.query({
      query: () => ({
        url: "/order/recently-sold-products",
        method: "GET",
      }),
    }),

    getPopularProducts: builder.query({
      query: () => ({
        url: "/product/popular-products",
        method: "GET",
      }),
    }),

  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useGetProductsByCategoryAndTagQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useSearchProductsQuery,
  useGetProductsByAuthorQuery,
  useGetRecentlySoldProductsQuery,
  useGetPopularProductsQuery,
} = productApi;
