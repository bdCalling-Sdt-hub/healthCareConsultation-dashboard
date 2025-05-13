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

    updateBookings: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "PATCH",
          url: `/bookings/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["bookings"],
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
          url: `/user/schedule/${date}?timeZone=${timeZone}`,
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
  useUpdateBookingsMutation,
  useGetSlotsByDateQuery,
  useManageSlotsMutation,
} = bookingSlice;
