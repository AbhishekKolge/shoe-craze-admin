import { apiSlice } from '../../app/api/apiSlice';

export const useApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    showMe: builder.query({
      query: () => ({
        url: '/users/show-me',
      }),
      providesTags: ['User'],
    }),
    uploadProfileImage: builder.mutation({
      query: (fileData) => ({
        url: '/users/profile-image',
        method: 'POST',
        body: fileData,
      }),
      invalidatesTags: ['User'],
    }),
    removeProfileImage: builder.mutation({
      query: (profileImageId) => ({
        url: '/users/profile-image',
        method: 'DELETE',
        params: { profileImageId },
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (userDetails) => ({
        url: '/users',
        method: 'PATCH',
        body: userDetails,
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: (queries) => {
        return {
          url: '/users',
          params: queries,
        };
      },
      providesTags: ['Users'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ statusData, userId }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: statusData,
      }),
      invalidatesTags: ['Users'],
    }),
    removeUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useShowMeQuery,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useRemoveUserMutation,
} = useApiSlice;
