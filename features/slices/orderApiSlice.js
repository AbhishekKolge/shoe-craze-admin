import { apiSlice } from '../../app/api/apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (queries) => ({
        url: '/order/all',
        params: queries,
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const { useGetOrdersQuery } = orderApiSlice;
