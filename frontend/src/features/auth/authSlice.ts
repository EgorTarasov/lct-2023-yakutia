import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { User } from '../../app/services/api'

type AuthState = {
  user: User | null
  token: string | null
  isAuth: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuth: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCredentials: (state,{ payload: { user, token } }: PayloadAction<{ user: User; token: string }>) => {
      state.user = user
      state.token = token
    },
    setUserToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;
    },
    setIsAuth: (state) => {
      const isAuth = true;
      state.isAuth = isAuth;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("persist:root");
    },

  },
})

export const { setCredentials,setUserToken,setIsAuth,logout } = authSlice.actions

export const { reducer: authSliceReducer } = authSlice;


export const selectCurrentUser = (state: RootState) => state.authSlice.user
export const selectIsAuth = (state: RootState) => state.authSlice.isAuth

