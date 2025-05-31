import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateTermsAndConditions: builder.mutation({
      query: (data) => {
        return {
          url: `/public`,
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
    }),
    termsAndCondition: builder.query({
      query: () => {
        return {
          url: `/public/terms-and-condition`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
    }),

    //public

    createAndUpdateFooterItems: builder.mutation({
      query: (data) => {
        console.log("in slice =>", data);
        return {
          url: `/public/information`,
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        };
      },
    }),

    getFooterItems: builder.query({
      query: () => {
        return {
          url: `/public/information/get`,
          method: "GET",
        };
      },
    }),

    editPageDescription: builder.mutation({
      query: (data) => {
        return {
          url: `/public/page-description`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["PageDescriptions"],
    }),

    getPageDescriptions: builder.query({
      query: () => {
        return {
          url: `/public/page-description/get`,
          method: "GET",
        };
      },
      providesTags: ["PageDescriptions"],
    }),
  }),
});

export const {
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
  useEditPageDescriptionMutation,
  useGetPageDescriptionsQuery,
  useCreateAndUpdateFooterItemsMutation,
  useGetFooterItemsQuery,
} = termsAndConditionSlice;
