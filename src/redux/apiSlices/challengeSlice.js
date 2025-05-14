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
      providesTags: ["challenges"],
    }),

    createChallenge: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/challenges",
          body: data,
        };
      },
      invalidatesTags: ["challenges"],
    }),

    updateChallenge: builder.mutation({
      query: ({ id, data }) => {
        return {
          method: "PATCH",
          url: `/challenges/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["challenges"],
    }),

    deleteChallenge: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/challenges/${id}`,
        };
      },
      invalidatesTags: ["challenges"],
    }),
  }),
});

export const {
  useGetChallengesQuery,
  useCreateChallengeMutation,
  useUpdateChallengeMutation,
  useDeleteChallengeMutation,
} = challengeSlice;
