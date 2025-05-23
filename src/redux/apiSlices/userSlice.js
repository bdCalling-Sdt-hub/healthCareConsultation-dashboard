import { api } from "../api/baseApi";

const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    admin: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user?role=ADMIN",
        };
      },
    }),

    users: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user/all-users",
        };
      },
    }),

    vendors: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user?role=VENDOR",
        };
      },
    }),

    userById: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/user/profile/${id}`,
        };
      },
    }),

    getFilesByUserId: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/file/user/${id}`,
        };
      },
    }),

    downloadFile: builder.mutation({
      query: (id) => {
        return {
          method: "GET",
          url: `/file/download/${id}`,
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

export const {
  useAdminQuery,
  useUsersQuery,
  useVendorsQuery,
  useUserByIdQuery,
  useGetFilesByUserIdQuery,
  useDownloadFileMutation,
} = userSlice;
