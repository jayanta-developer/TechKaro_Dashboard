import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Reloader } from "../Components/Tools";

export const baseURL = import.meta.env.VITE_BASE_URL;

export const STATUSES = {
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
} as const;
export type STATUSES = (typeof STATUSES)[keyof typeof STATUSES];

export interface categoryDataType {
  title: string;
  icon: string;
  _id?: string;
}
export interface categoryUpdateDataType {
  title?: string;
  icon?: string;
  _id?: string;
}
export interface CategoryUpdateArg {
  id: string;
  data: categoryUpdateDataType;
}

interface categoryState {
  data: categoryDataType[];
  status: STATUSES;
}
// Initial state
const initialState: categoryState = {
  data: [],
  status: STATUSES.LOADING,
};

//fatch Category
export const FetchCategory = createAsyncThunk<categoryDataType[]>(
  "Category/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseURL}/categories`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      toast.error("Failed to fetch categories.");
      return rejectWithValue(error.message);
    }
  }
);


export const CreateCategory = createAsyncThunk<categoryDataType, categoryDataType>(
  "Category/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post(`${baseURL}/category/create`, {
        ...data,
      });
      toast.success("Category created successfully.");
      Reloader(600);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      Reloader(900);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Update Category
export const UpdateCategory = createAsyncThunk<
  CategoryUpdateArg,
  CategoryUpdateArg
>("Category/update", async ({ data, id }, { rejectWithValue }) => {
  try {
    const response = await Axios.post(`${baseURL}/category/update/${id}`, data);
    toast.success("Category updated successfully !");
    Reloader(1000);
    return response.data;
  } catch (error: any) {
    toast.error("Failed to update Category");
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});


//delete Category
export const DeleteCategory = createAsyncThunk<void, string>(
  "Category/delete",
  async (id) => {
    try {
      await Axios.post(`${baseURL}/category/delete/${id}`).then(() => {
        toast.info("Category deleted successfully !");
        Reloader(1000);
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Internal server error!");
    }
  }
);



const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    get: (state, action: PayloadAction<categoryDataType[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchCategory.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchCategory.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchCategory.rejected, (state) => {
        state.status = STATUSES.ERROR;
      })

      .addCase(CreateCategory.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export const { get } = categorySlice.actions;
export default categorySlice.reducer;
