import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { logoutHandler } from '../../features/actions/authActions';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    api.dispatch(logoutHandler({ isSession: true }));
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    'User',
    'ReturnReason',
    'Category',
    'Size',
    'Coupon',
    'Product',
    'Users',
    'Order',
  ],
  endpoints: (builder) => ({}),
});
