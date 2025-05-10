import { api } from "../api/baseApi";

const notificationSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    notification: builder.query({
      query: () => {
        return {
          url: `/notification`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      providesTags: ["notification"],
    }),
    read: builder.mutation({
      query: (id) => {
        return {
          url: `/notification/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      invalidatesTags: ["notification"],
    }),
  }),
});

export const { useNotificationQuery, useReadMutation } = notificationSlice;
