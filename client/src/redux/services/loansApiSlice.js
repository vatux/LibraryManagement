import { buildCreateApi } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

export const loansApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getLoans: builder.query({
            query: () => '/loans',
            keepUnusedDataFor: 5,
          }),
          getLoansById: builder.query({
            query: (id) => `/loans/${id}`,
          }),
          addLoans: builder.mutation({
            query: (newLoan) => ({
              url: '/loans/add',
              method: 'POST',
              body: newLoan,
            }),
          }),
          updateLoans: builder.mutation({
            query: (loan) => ({
              url: `/loans/update/`,
              method: 'POST',
              body: loan,
            }),
          }),
          deleteLoans: builder.mutation({
            query: (id) => ({
              url: `/loans/delete`,
              method: 'POST',
              body: {_id: id},
            }),
          }),
    })
})

export const  {
    useGetLoansQuery, 
    useGetLoansByIdQuery, 
    useAddLoansMutation,
    useUpdateLoansMutation,
    useDeleteLoansMutation,
} = loansApiSlice;