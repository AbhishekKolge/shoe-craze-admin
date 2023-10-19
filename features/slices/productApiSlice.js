import { apiSlice } from '../../app/api/apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (queries) => {
        return {
          url: '/product',
          params: queries,
        };
      },
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/product',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/product/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ productData, productId }) => ({
        url: `/product/${productId}`,
        method: 'PATCH',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    getSingleProduct: builder.query({
      query: (productId) => {
        return {
          url: `/product/${productId}`,
        };
      },
      providesTags: ['Product'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetSingleProductQuery,
} = productApiSlice;
