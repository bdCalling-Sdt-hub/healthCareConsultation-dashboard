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

    deleteInsight: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/insights/${id}`,
        };
      },
      invalidatesTags: ["Insights"],
    }),

    // sections
    getAllSectionsByInsightId: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/insights/sections/${id}`,
        };
      },
      providesTags: ["Sections"],
    }),

    createSection: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "POST",
          url: `/insights/sections/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Sections"],
    }),

    updateSection: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/insights/sections/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Sections"],
    }),

    deleteSection: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/insights/sections/${id}`,
        };
      },
      invalidatesTags: ["Sections"],
    }),

    //bars

    createBars: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "POST",
          url: `/insights/sections/bars/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Sections", "Insights"],
    }),

    // chart
    createInsightChart: builder.mutation({
      query: (data) => {
        console.log("from redux", data);

        return {
          method: "POST",
          url: `/dashboard/chart`,
          body: data,
        };
      },
      invalidatesTags: ["Sections", "Insights"],
    }),

    getAllInsightChart: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/dashboard/chart`,
        };
      },
      providesTags: ["Insights"],
    }),
  }),
});

export const {
  useInsightsQuery,
  useCreateInsightMutation,
  useUpdateInsightMutation,
  useDeleteInsightMutation,

  // sections
  useGetAllSectionsByInsightIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,

  // bars
  useCreateBarsMutation,

  // chart
  useCreateInsightChartMutation,
  useGetAllInsightChartQuery,
} = insightsSlice;
