import { buildCreateApi } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

export const booksCopiesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBooksCopies: builder.query({
            query: () => '/bookscopies',
            keepUnusedDataFor: 5,
          }),
          getBooksCopiesById: builder.query({
            query: (id) => `/bookscopies/${id}`,
          }),
          addBooksCopies: builder.mutation({
            query: (newUser) => ({
              url: '/bookscopies/add',
              method: 'POST',
              body: newUser,
            }),
          }),
          updateBooksCopies: builder.mutation({
            query: (bookscopy) => ({
              url: `/bookscopies/update/`,
              method: 'POST',
              body: bookscopy,
            }),
          }),
          deleteBooksCopies: builder.mutation({
            query: (id) => ({
              url: `/bookscopies/delete`,
              method: 'POST',
              body: {_id: id},
            }),
          }),
    })
})

export const  {
    useGetBooksCopiesQuery, 
    useGetBooksCopiesByIdQuery, 
    useAddBooksCopiesMutation,
    useUpdateBooksCopiesMutation,
    useDeleteBooksCopiesMutation,
} = booksCopiesApiSlice;