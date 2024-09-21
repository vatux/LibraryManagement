import { buildCreateApi } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

export const authorsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAuthors: builder.query({
            query: () => '/authors',
            keepUnusedDataFor: 5,
          }),
          getAuthorById: builder.query({
            query: (id) => `/authors/${id}`,
          }),
          addAuthor: builder.mutation({
            query: (newAuthor) => ({
              url: '/authors/add',
              method: 'POST',
              body: newAuthor,
            }),
          }),
          updateAuthor: builder.mutation({
            query: (author) => ({
              url: `/authors/update/`,
              method: 'POST',
              body: author,
            }),
          }),
          deleteAuthor: builder.mutation({
            query: (id) => ({
              url: `/authors/delete`,
              method: 'POST',
              body: {_id: id},
            }),
          }),
    })
})

export const  {
    useGetAuthorsQuery, 
    useGetAuthorByIdQuery, 
    useAddAuthorMutation,
    useDeleteAuthorMutation,
    useUpdateAuthorMutation
} = authorsApiSlice;