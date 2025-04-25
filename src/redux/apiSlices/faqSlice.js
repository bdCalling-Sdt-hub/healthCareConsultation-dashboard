import { api } from "../api/baseApi";

const faqSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    allFaqs: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/faq",
        };
      },
      providesTags: ["Faqs"],
    }),

    addFaq: builder.mutation({
      query: (data) => {
        console.log("sdvsdvsvdgsdrv", data);

        return {
          method: "POST",
          url: "/faq",
          body: data,
        };
      },
      invalidatesTags: ["Faqs"],
    }),

    updateFaq: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/faq/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Faqs"],
    }),

    deleteFaq: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/faq/${id}`,
        };
      },
      invalidatesTags: ["Faqs"],
    }),
  }),
});

export const {
  useAllFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqSlice;
