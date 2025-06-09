import { configureStore } from "@reduxjs/toolkit";

import categoryReducer from "./CategorySlice";
import productReducer from "./ProductSlice"
import blogReducer from "./blogSlice"
import userReducer from "./userSlice"
import reviewReducer from "./reviewSlice"

export const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    blog: blogReducer,
    user: userReducer,
    review: reviewReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
