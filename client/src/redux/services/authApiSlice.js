import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
              url: '/login',
              method: 'POST',
              body: { ...credentials },
            })
          })
    })
})

export const {
    useLoginMutation
} = authApiSlice