/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query<any, void>({
      query: () => ({
        url: "/order",
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/order/create-order",
        method: "POST",
        body: data,
      }),
    }),
    getSingleOrder: builder.query<any, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    trackOrder: builder.query<any, string>({
      query: (trackingNumber) => ({
        url: `/order/track/${trackingNumber}`,
        method: "GET",
      }),
      transformResponse: (response: { data: any }) => response.data,
    }),
    getMyOrders: builder.query<any, { customerId: string; page?: number; limit?: number }>({
      query: ({ customerId, page = 1, limit = 10 }) => ({
        url: `/order/my-order/${customerId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useCreateOrderMutation,
  useTrackOrderQuery,
  useGetMyOrdersQuery,
} = orderApi;
