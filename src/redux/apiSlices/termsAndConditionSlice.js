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
  }),
});

export const {
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionSlice;
