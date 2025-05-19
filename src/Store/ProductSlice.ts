import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Reloader } from "../Components/Tools";
import { STATUSES } from "./CategorySlice"

export const baseURL = import.meta.env.VITE_BASE_URL;


export interface productDataType {
  title: string;
  image?: string;
  aboutTitle?: string;
  aboutSummary?: string;
  bannerTitle: string;
  bannerSummary: string;
  bannerImg?: string;
  userCoutnTitle: string;
  userCountValue: string;
  infoCountTitle: string;
  infoCountValue: string;
  KeyInsights?: { title: string, value: string }[];
  AdvertisingCost?: { title: string, value: string }[];
  About?: { title: string, summary: string };
  userCount?: { title: string, count: string };
  infoCount?: { title: string, count: string };
  summary?: {
    title: string,
    summarys: { summary: string }[]
  }[];
  bannerData?: {
    title: string;
    summary: string;
    img?: string
  }
}

interface productState {
  data: productDataType[];
  status: STATUSES;
}

// Initial state
const initialState: productState = {
  data: [],
  status: STATUSES.LOADING,
};


export const FetchProduct = createAsyncThunk<productDataType[]>(
  "product/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/products`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error("Failed to fetch products.");
      return rejectWithValue(error.message);
    }
  }
);

export const CreateProduct = createAsyncThunk<productDataType, productDataType>(
  "product/create",
  async (data, { rejectWithValue }) => {
    console.log(data);

    try {
      const response = await Axios.post(`${baseURL}/product/create`, {
        ...data,
      });
      toast.success("product created successfully.");
      // Reloader(600);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      // Reloader(900);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    get: (state, action: PayloadAction<productDataType[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchProduct.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchProduct.rejected, (state) => {
        state.status = STATUSES.ERROR;
      })

      .addCase(CreateProduct.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export const { get } = productSlice.actions;
export default productSlice.reducer;