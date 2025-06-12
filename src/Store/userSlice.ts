import Axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { STATUSES } from "./CategorySlice";
import { toast } from "react-toastify";
import { Reloader } from "../Components/Tools";

export const baseURL = import.meta.env.VITE_BASE_URL;

interface UserDataType {
  name: string;
  number: string;
  email: string;
  message?: string;
  subject: string;
  leads: string;
  date: string;
  _id?: string;
}

interface UserState {
  data: UserDataType[];
  status: STATUSES;
}

// Initial state
const initialState: UserState = {
  data: [],
  status: STATUSES.LOADING,
};

// Fetch all users
export const FetchUsers = createAsyncThunk<UserDataType[]>(
  "user/fetchAll",
  async () => {
    const response = await fetch(`${baseURL}/users`);
    const data = await response.json();
    return data;
  }
);

// Fetch a single user by ID (you should receive an ID here)
export const FetchUserById = createAsyncThunk<UserDataType, string>(
  "user/fetchById",
  async (userId) => {
    const response = await fetch(`${baseURL}/users/${userId}`);
    const data = await response.json();
    return data;
  }
);

// Create a new user
export const CreateUser = createAsyncThunk<UserDataType, UserDataType>(
  "user/create",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await Axios.post(`${baseURL}/user/create`, userData);
      toast.success("Submitted successfully.");
      Reloader(600);
      return response.data;
    } catch (error: any) {
      toast.error("Something went wrong");
      Reloader(900);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserDataType[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchUsers.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(FetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(FetchUsers.rejected, (state) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
