/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /users
    getAllUser: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),

    // GET /user/admins
    getAllAdminUser: builder.query({
      query: () => ({
        url: "/user/admins",
        method: "GET",
      }),
    }),

    // GET /user/vendors
    getAllVendorUser: builder.query({
      query: () => ({
        url: "/user/vendors",
        method: "GET",
      }),
    }),

    // GET /user/admins/:id   (super‑admin)
    getSuperAdmin: builder.query({
      query: (id) => ({
        url: `/user/admins/${id}`,
        method: "GET",
      }),
    }),

    // GET /user/:id
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),

    // PATCH /user/:id
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body: data as any,
      }),
    }),

    // DELETE /user/:id
    deleteSingleUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
    }),
    changePassword: builder.mutation<
      { success: boolean; message: string; data?: any },
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/users/change-password", // ← matches your backend
        method: "PATCH",
        body,
      }),
    }),
  }),
});

/* ------------------------------------------------------------------
   Exported hooks – use them exactly like your category hooks
------------------------------------------------------------------- */
export const {
  useGetAllUserQuery,
  useGetAllAdminUserQuery,
  useGetAllVendorUserQuery,
  useGetSuperAdminQuery,
  useGetSingleUserQuery,
  useUpdateUserMutation,
  useDeleteSingleUserMutation,
  useChangePasswordMutation,
} = userApi;
