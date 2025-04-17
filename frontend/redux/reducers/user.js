import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
  addressloading: false,
  successMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // update user information
    updateUserInfoRequest: (state) => {
      state.loading = true;
    },
    updateUserInfoSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateUserInfoFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // update user address
    updateUserAddressRequest: (state) => {
      state.addressloading = true;
    },
    updateUserAddressSuccess: (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    },
    updateUserAddressFailed: (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    },

    // delete user address
    deleteUserAddressRequest: (state) => {
      state.addressloading = true;
    },
    deleteUserAddressSuccess: (state, action) => {
      state.addressloading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    },
    deleteUserAddressFailed: (state, action) => {
      state.addressloading = false;
      state.error = action.payload;
    },

    // clear errors
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  updateUserInfoFailed,
  updateUserInfoRequest,
  updateUserInfoSuccess,
  updateUserAddressFailed,
  updateUserAddressSuccess,
  updateUserAddressRequest,
  deleteUserAddressFailed,
  deleteUserAddressRequest,
  deleteUserAddressSuccess,
  clearErrors,
} = userSlice.actions;
export default userSlice.reducer;