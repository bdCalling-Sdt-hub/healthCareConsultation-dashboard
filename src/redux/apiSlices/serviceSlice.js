import { api } from "../api/baseApi";

const serviceSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllServices: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/service",
        };
      },
      providesTags: ["Services"],
    }),

    getSingleService: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/service/${id}`,
        };
      },
    }),

    createService: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/service/create-service",
          body: data,
        };
      },
      invalidatesTags: ["Services"],
    }),

    editService: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "PATCH",
          url: `/service/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Services"],
    }),

    deleteService: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/service/${id}`,
        };
      },
      invalidatesTags: ["Services"],
    }),

    //get all tabs

    getAllTabs: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/tabs/service/${id}`,
        };
      },
      providesTags: ["Tabs"],
    }),

    createTabs: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/tabs/create-tabs",
          body: data,
        };
      },
      invalidatesTags: ["Tabs"],
    }),

    updateTabs: builder.mutation({
      query: ({ data, id }) => {
        return {
          method: "PATCH",
          url: `/tabs/${id}`,
          body: data,
        };
      },
      invalidatesTags: ["Tabs"],
    }),

    deleteTabs: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/tabs/${id}`,
        };
      },
      invalidatesTags: ["Tabs"],
    }),
  }),
});

export const {
  useGetAllServicesQuery,
  useGetSingleServiceQuery,
  useCreateServiceMutation,
  useEditServiceMutation,
  useDeleteServiceMutation,

  //get all tabs
  useGetAllTabsQuery,
  useCreateTabsMutation,
  useUpdateTabsMutation,
  useDeleteTabsMutation,
} = serviceSlice;
