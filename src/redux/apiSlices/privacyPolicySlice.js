import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePricyPolicy: builder.mutation({
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
    privacyPolicy: builder.query({
      query: () => {
        return {
          url: `/public/privacy-policy`,
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

export const { useUpdatePricyPolicyMutation, usePrivacyPolicyQuery } =
  privacyPolicySlice;
