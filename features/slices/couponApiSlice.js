import { apiSlice } from '../../app/api/apiSlice';

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (queries) => {
        return {
          url: '/coupon',
          params: queries,
        };
      },
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: '/coupon',
        method: 'POST',
        body: couponData,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/coupon/${couponId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ couponData, couponId }) => ({
        url: `/coupon/${couponId}`,
        method: 'PATCH',
        body: couponData,
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponMutation,
} = couponApiSlice;
