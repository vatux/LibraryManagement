import { buildCreateApi } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            keepUnusedDataFor: 5,
          }),
          getUsersById: builder.query({
            query: (id) => `/users/${id}`,
          }),
          addUser: builder.mutation({
            query: (newUser) => ({
              url: '/users/add',
              method: 'POST',
              body: newUser,
            }),
          }),
          updateUser: builder.mutation({
            query: (user) => ({
              url: `/users/update/`,
              method: 'POST',
              body: user,
            }),
          }),
          deleteUser: builder.mutation({
            query: (id) => ({
              url: `/users/delete`,
              method: 'POST',
              body: {_id: id},
            }),
          }),
    })
})

export const  {
    useGetUsersQuery, 
    useGetUserByIdQuery, 
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApiSlice;