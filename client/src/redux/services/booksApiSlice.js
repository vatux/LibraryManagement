import { buildCreateApi } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

export const booksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBooks: builder.query({
            query: () => '/books',
            keepUnusedDataFor: 5,
          }),
          getBookById: builder.query({
            query: (id) => `/books/${id}`,
          }),
          addBook: builder.mutation({
            query: (newBook) => ({
              url: '/books/add',
              method: 'POST',
              body: newBook,
            }),
          }),
          updateBook: builder.mutation({
            query: (book) => ({
              url: `/books/update/`,
              method: 'POST',
              body: book,
            }),
          }),
          deleteBook: builder.mutation({
            query: (id) => ({
              url: `/books/delete`,
              method: 'POST',
              body: {_id: id},
            }),
          }),
    })
})

export const  {
    useGetBooksQuery, 
    useGetBookByIdQuery, 
    useAddBookMutation,
    useDeleteBookMutation,
    useUpdateBookMutation
} = booksApiSlice;