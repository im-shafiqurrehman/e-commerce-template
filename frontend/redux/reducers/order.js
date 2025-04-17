import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  orders: [],
  adminOrders: [],
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Get all orders of user
    getAllOrdersUserRequest: (state) => {
      state.isLoading = true;
    },
    getAllOrdersUserSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    },
    getAllOrdersUserFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get all orders of shop
    getAllOrdersShopRequest: (state) => {
      state.isLoading = true;
    },
    getAllOrdersShopSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    },
    getAllOrdersShopFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get all orders for admin
    adminAllOrdersRequest: (state) => {
      state.isLoading = true;
    },
    adminAllOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.adminOrders = action.payload;
    },
    adminAllOrdersFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  getAllOrdersShopRequest,
  getAllOrdersShopSuccess,
  getAllOrdersShopFailed,
  adminAllOrdersRequest,
  adminAllOrdersSuccess,
  adminAllOrdersFailed,
  clearErrors,
} = orderSlice.actions;

export default orderSlice.reducer;
