import { configureStore } from "@reduxjs/toolkit";

import categoryReducer from "./CategorySlice";
import productReducer from "./ProductSlice"

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
