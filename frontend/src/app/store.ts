import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { authSliceReducer } from "../features/auth/authSlice";


const rootReducer = combineReducers({
    authSlice: authSliceReducer,
    [api.reducerPath]: api.reducer,
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch']