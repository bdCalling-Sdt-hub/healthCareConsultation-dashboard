import { api } from "../api/baseApi";

const ourWaySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getOurWays: builder.query({
      query: () => ({
        url: "/healthcareconsultant",
        method: "GET",
      }),
      providesTags: ["ourWay"],
    }),

    editOurWay: builder.mutation({
      query: ({ data, id }) => ({
        url: `/healthcareconsultant/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ourWay"],
    }),
  }),
});

export const { useGetOurWaysQuery, useEditOurWayMutation } = ourWaySlice;
