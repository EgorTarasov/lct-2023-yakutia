import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { api } from "./services/auth";

export const store = configureStore({
    reducer: {
        [api.reducerPath] : api.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch']