import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get all reviews
    getAllReviews: builder.query({
      query: () => `/reviews`,
      providesTags: ["Review"],
    }),

    // ✅ Get a single review by ID
    getSingleReview: builder.query({
      query: (id: string) => `/reviews/${id}`,
      providesTags: ["Review"],
    }),

    // ✅ Get approved reviews for a specific product
    getApprovedReviewsByProduct: builder.query({
      query: (productId: string) => `/reviews/product/${productId}`,
      providesTags: ["Review"],
    }),

    // ✅ Create a new review (with up to 5 photos)
    createReview: builder.mutation({
      query: (data: FormData) => ({
        url: `/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),

    // ✅ Update a review (with optional photo re-upload)
    updateReview: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),

    // ✅ Delete a review
    deleteReview: builder.mutation({
      query: (id: string) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),

  // add tag type
  overrideExisting: false,
});

export const {
  useGetAllReviewsQuery,
  useGetSingleReviewQuery,
  useGetApprovedReviewsByProductQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
