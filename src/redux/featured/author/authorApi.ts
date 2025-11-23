/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { TAuthor } from "@/types/author/author";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /author/ → returns only the array of authors
    getAllAuthors: builder.query<TAuthor[], void>({
      query: () => ({
        url: "/author/",
        method: "GET",
      }),
      transformResponse: (response: { data: TAuthor[] }) => response.data,
      providesTags: ["Author"],
    }),

    // GET /author/:id
    getSingleAuthors: builder.query<TAuthor, string>({
      query: (id) => ({
        url: `/author/${id}`,
        method: "GET",
      }),
      // Optional: if single author also wrapped in { data: ... }
      transformResponse: (response: { data: TAuthor }) => response.data,
    }),
    // Follow mutation
    followAuthor: builder.mutation<TAuthor, string>({
      query: (id) => ({
        url: `/author/${id}/follow`,
        method: "PATCH",
        body: {},
      }),
      transformResponse: (res: { data: TAuthor }) => res.data,

      // Invalidate all authors to refresh the list
      invalidatesTags: ["Author"],
    }),
  }),
});

export const {
  useGetAllAuthorsQuery,
  useGetSingleAuthorsQuery,
  useFollowAuthorMutation,
} = categoryApi;
