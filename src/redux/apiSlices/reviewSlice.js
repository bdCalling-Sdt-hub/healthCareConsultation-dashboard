import { api } from "../api/baseApi";

const reviewSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    reviews: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/review",
        };
      },
      providesTags: ["reviews"],
    }),

    createReview: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/review",
          body: data,
        };
      },
      invalidatesTags: ["reviews"],
    }),

    updateReview: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/review/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["reviews"],
    }),

    deleteReview: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/review/${id}`,
        };
      },
      invalidatesTags: ["reviews"],
    }),
  }),
});

export const {
  useReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewSlice;
