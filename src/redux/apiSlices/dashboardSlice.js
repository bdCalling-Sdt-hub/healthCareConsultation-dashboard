import { api } from "../api/baseApi";

const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    generalStats: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/dashboard/general-statistics",
        };
      },
    }),
    revenueStates: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `/dashboard/revenue-calculation`,
        };
      },
    }),

    bestServices: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/dashboard/service-analytics",
        };
      },
    }),

    bookingStatistics: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/dashboard/booking-statistics",
        };
      },
    }),
  }),
});

export const {
  useGeneralStatsQuery,
  useRevenueStatesQuery,
  useBestServicesQuery,
  useBookingStatisticsQuery,
} = dashboardSlice;
