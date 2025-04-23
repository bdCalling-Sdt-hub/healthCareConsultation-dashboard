import { api } from "../api/baseApi";

const insightsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    insights: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/insights",
        };
      },
      providesTags: ["Insights"],
    }),

    createInsight: builder.mutation({
      query: ({ data }) => {
        return {
          method: "POST",
          url: "/insights/create",
          body: data,
        };
      },
      invalidatesTags: ["Insights"],
    }),

    updateInsight: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/insights/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Insights"],
    }),
  }),
});

export const {
  useInsightsQuery,
  useCreateInsightMutation,
  useUpdateInsightMutation,
} = insightsSlice;
