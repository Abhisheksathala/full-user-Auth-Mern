import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default storage is localStorage for web
import { version } from "react";


const rootreducer = combineReducers({ user: userReducer });
const persistConfig = {
    key: "root",
    storage,
    version: 1,
    };
const persistedReducer = persistReducer(persistConfig, rootreducer);


export const store = configureStore({
  reducer:  persistedReducer ,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
