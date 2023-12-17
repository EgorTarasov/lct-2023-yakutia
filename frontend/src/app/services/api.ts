import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../store'

export type User = {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string

}

export interface UserResponse {
  access_token: string
}

export type SignUpRequest = {
  first_name: string
  last_name: string
  email: string
  password: string
}


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://larek.itatmisis.ru/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).authSlice.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({

    // AUTH

    login: builder.mutation<UserResponse, FormData>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    signUp: builder.mutation<UserResponse, SignUpRequest>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    // USER

    getPredictions: builder.query<{ message: string }, void>({
      query: () => 'user/pred',
    }),
    
    getMe: builder.query<{ message: string }, void>({
      query: () => 'user/me',
    }),


    // PROFESSION

    getProfessions: builder.query<{ message: string }, void>({
      query: () => 'profession/all',
    }),

    getProfessionById: builder.query<{ id: number, name: string, descriptions: { description: string }[] }, number>({
      query: (id) => `profession/i/${id}`,
    }),


    // STATS

    getSexStats: builder.query<{ age: number, cnt: number, sex: string }[], void>({
      query: () => 'stats/sex',
    }),

    getAgeStats: builder.query<{ age: number, cnt: number }[], void>({
      query: () => 'stats/age',
    }),
    
  }),
})

export const { useLoginMutation, useGetProfessionsQuery, useGetMeQuery, useGetPredictionsQuery, useSignUpMutation, useGetProfessionByIdQuery, useGetSexStatsQuery, useGetAgeStatsQuery } = api
