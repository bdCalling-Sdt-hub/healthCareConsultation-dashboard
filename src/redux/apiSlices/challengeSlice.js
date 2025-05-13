import { api } from "../api/baseApi";

const challengeSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getChallenges: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/challenges",
        };
      },
    }),

    createChallenge: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/challenges",
          data: data,
        };
      },
    }),
  }),
});

export const { useGetChallengesQuery, useCreateChallengeMutation } =
  challengeSlice;
