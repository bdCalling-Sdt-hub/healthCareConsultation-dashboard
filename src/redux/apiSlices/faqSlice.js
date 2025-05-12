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

    //about us
    allAboutUs: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/about",
        };
      },
      providesTags: ["AboutUs"],
    }),

    updateAboutUs: builder.mutation({
      query: ({ data }) => {
        return {
          method: "POST",
          url: `/about`,
          body: data,
        };
      },
      invalidatesTags: ["AboutUs"],
    }),
  }),
});

export const {
  useAllFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,

  //about us
  useAllAboutUsQuery,
  useUpdateAboutUsMutation,
} = faqSlice;
