import { api } from "../api/baseApi";

const bookingSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    allBookings: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/bookings/",
        };
      },
    }),

    getSlots: builder.query({
      query: () => {
        return {
          method: "GET",
          url: `user/schedule`,
        };
      },
      providesTags: ["slots"],
    }),

    getSlotsByDate: builder.query({
      query: ({ date, timeZone }) => {
        return {
          method: "GET",
          url: `/user/schedule/${date}?timezone=${timeZone}`,
        };
      },
      providesTags: ["slots"],
    }),

    manageSlots: builder.mutation({
      query: (date) => {
        return {
          method: "POST",
          url: `/user/schedule`,
          body: date,
        };
      },
      invalidatesTags: ["slots"],
    }),
  }),
});

export const {
  useAllBookingsQuery,
  useGetSlotsQuery,
  useGetSlotsByDateQuery,
  useManageSlotsMutation,
} = bookingSlice;
