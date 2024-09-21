import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("baseQueryWithReauth is called");
  let result = await baseQuery(args, api, extraOptions)
  console.log("API result:", result);

  if (result?.error?.originalStatus === 403) {
    console.log("sending refresh token")

    const refreshResult = await baseQuery('/refresh', api, extraOptions)
    console.log("refreshResult:", refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user
      // Store new token
      api.dispatch(setCredentials({ ...refreshResult.data, user }))
      // Retry the original query with access token
      result = await baseQuery(args, api, extraOptions)
    }
    else {
      console.log("LOGOUT!!");
      api.dispatch(logOut())
    }
  }
  else{
    console.log("Other status code:", result?.error?.status);
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({})
})
