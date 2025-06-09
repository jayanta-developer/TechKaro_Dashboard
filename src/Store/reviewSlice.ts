import Axios from "axios";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { STATUSES } from "./CategorySlice";
import { toast } from "react-toastify";
import { Reloader } from "../Components/Tools";

export const baseURL = import.meta.env.VITE_BASE_URL;

// Types
export interface ReviewDataType {
  rating: string;
  review: string;
  userName: string;
  image?: string;
  status?: string;
  _id?: string;
}
export interface ReviewUpdateDataType {
  rating?: string;
  review?: string;
  userName?: string;
  image?: string;
  status?: string;
  _id?: string;
}

interface ReviewState {
  data: ReviewDataType[];
  status: STATUSES;
}

interface ReviewUpdateArg {
  id: string;
  data: ReviewUpdateDataType;
}


// Initial State
const initialState: ReviewState = {
  data: [],
  status: STATUSES.LOADING,
};

// Fetch all reviews
export const FetchReview = createAsyncThunk<ReviewDataType[]>(
  "review/fetchAll",
  async () => {
    const response = await fetch(`${baseURL}/review`);
    const data = await response.json();
    return data;
  }
);

// Create review
export const CreateReview = createAsyncThunk<ReviewDataType, ReviewDataType>(
  "review/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await Axios.post(`${baseURL}/review/create`, data);
      toast.success("Your review submitted successfully.");
      Reloader(600);
      return response.data;
    } catch (error: any) {
      toast.error("Something went wrong", error.response?.data || "");
      Reloader(900);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Update Review
export const UpdateReview = createAsyncThunk<
  ReviewUpdateArg,
  ReviewUpdateArg
>("review/update", async ({ data, id }, { rejectWithValue }) => {
  try {
    const response = await Axios.post(`${baseURL}/review/update/${id}`, data);
    toast.success("Review updated successfully !");
    Reloader(1000);
    return response.data;
  } catch (error: any) {
    toast.error("Failed to update Review");
    Reloader(900);
    return rejectWithValue(error.response?.data || "An error occurred");
  }
});

//delete Review
export const DeleteReview = createAsyncThunk<void, string>(
  "review/delete",
  async (id) => {
    try {
      await Axios.post(`${baseURL}/review/delete/${id}`).then(() => {
        toast.info("Review deleted successfully !");
        Reloader(1000);
      });
    } catch (error) {
      console.error("Error deleting review", error);
      toast.error("Error deleting review!");
    }
  }
);



// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReview: (state, action: PayloadAction<ReviewDataType[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchReview.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchReview.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchReview.rejected, (state) => {
        state.status = STATUSES.ERROR;
      })
      .addCase(CreateReview.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(CreateReview.fulfilled, (state, action) => {
        state.data.unshift(action.payload); // Add new review to beginning of array
        state.status = STATUSES.IDLE;
      })
      .addCase(CreateReview.rejected, (state) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setReview } = reviewSlice.actions;
export default reviewSlice.reducer;
