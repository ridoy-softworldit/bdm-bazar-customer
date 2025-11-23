import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "@/redux/featured/auth/authSlice";
import cartReducer from "@/lib/slices/cartSlice";
import wishlistReducer from "@/lib/slices/wishlistSlice";
import {
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "cart",
    "wishlist",
    "user",
    "brand",
    "category",
    "coupon",
    "customer",
    "terms",
    "products",
    "orders",
    "faqs",
    "dashboard",
  ],
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);