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
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useCreateOrderMutation,
  useTrackOrderQuery,
} = orderApi;
