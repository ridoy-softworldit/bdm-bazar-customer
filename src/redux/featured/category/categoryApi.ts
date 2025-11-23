/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

import { TCategory } from "@/types/category/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /categories
    getAllCategories: builder.query<TCategory[], void>({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
    }),

    // GET /categories/:id
    getSingleCategory: builder.query<TCategory, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
    }),

    // POST /categories/create-category
    createCategory: builder.mutation<TCategory, Partial<TCategory>>({
      query: (data: any) => ({
        url: "/category/create-category",
        method: "POST",
        body: data,
      }),
    }),

    // DELETE /categories/delete-category/:id
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/categories/delete-category/${id}`,
        method: "DELETE",
      }),
    }),

    // GET /category/featured-categories
    getFeaturedCategories: builder.query({
      query: () => ({
        url: "/category/featured-categories",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetSingleCategoryQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetFeaturedCategoriesQuery,
} = categoryApi;
