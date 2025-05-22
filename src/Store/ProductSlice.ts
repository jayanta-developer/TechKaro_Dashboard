import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Reloader } from "../Components/Tools";
import { STATUSES } from "./CategorySlice"

export const baseURL = import.meta.env.VITE_BASE_URL;


export interface productStateType {
  title: string;
  aboutTitle: string;
  aboutSummary: string;
  userCoutnTitle: string;
  userCountValue: string;
  infoCountTitle: string;
  infoCountValue: string;
  bannerTitle: string;
  bannerSummary: string;
}
export interface productDataType {
  _id?: string;
  title: string;
  image: string;
  KeyInsights?: { title: string, value: string }[];
  AdvertisingCost?: { title: string, value: string }[];
  About: {
    title: string;
    summary: string
  }
  userCount: { title: string, count: string };
  infoCount: { title: string, count: string };
  summary: {
    title: string,
    summarys: { summary: string }[]
  }[];
  bannerData?: {
    title: string;
    summary: string;
    img?: string
  };
  category: string
}

interface productUpdateType {
  _id?: string;
  title?: string;
  image?: string;
  KeyInsights?: { title: string, value: string }[];
  AdvertisingCost?: { title: string, value: string }[];
  About?: {
    title: string;
    summary: string
  }
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
  };
  category?: string

}
interface productUpdateArge {
  id: string;
  data: productUpdateType
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
      Reloader(600);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      Reloader(900);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Update Product
export const UpdateProduct = createAsyncThunk<
  productUpdateType,
  productUpdateArge
>("Product/update", async ({ data, id }, { rejectWithValue }) => {
  try {
    const response = await Axios.post(`${baseURL}/product/update/${id}`, data);
    toast.success("Product updated successfully !");
    Reloader(1000);
    return response.data;
  } catch (error: any) {
    toast.error("Failed to update Product");
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});


// delete product
export const DeleteProduct = createAsyncThunk<void, string>(
  "Product/delete",
  async (id) => {
    try {
      await Axios.post(`${baseURL}/product/delete/${id}`).then(() => {
        toast.info("Product deleted successfully !");
        Reloader(1000);
      });
    } catch (error) {
      console.error("Error deleting Product:", error);
      toast.error("Internal server error!");
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