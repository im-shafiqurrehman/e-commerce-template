// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isLoading: false,
//   orders: [],
//   adminOrders: [],
//   error: null,
// };

// const orderSlice = createSlice({
//   name: "order",
//   initialState,
//   reducers: {
//     // Get all orders of user
//     getAllOrdersUserRequest: (state) => {
//       state.isLoading = true;
//     },
//     getAllOrdersUserSuccess: (state, action) => {
//       state.isLoading = false;
//       state.orders = action.payload;
//     },
//     getAllOrdersUserFailed: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },

//     // Get all orders of shop
//     getAllOrdersShopRequest: (state) => {
//       state.isLoading = true;
//     },
//     getAllOrdersShopSuccess: (state, action) => {
//       state.isLoading = false;
//       state.orders = action.payload;
//     },
//     getAllOrdersShopFailed: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },

//     // Get all orders for admin
//     adminAllOrdersRequest: (state) => {
//       state.isLoading = true;
//     },
//     adminAllOrdersSuccess: (state, action) => {
//       state.isLoading = false;
//       state.adminOrders = action.payload;
//     },
//     adminAllOrdersFailed: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },

//     // Clear errors
//     clearErrors: (state) => {
//       state.error = null;
//     },
//   },
// });

// export const {
//   getAllOrdersUserRequest,
//   getAllOrdersUserSuccess,
//   getAllOrdersUserFailed,
//   getAllOrdersShopRequest,
//   getAllOrdersShopSuccess,
//   getAllOrdersShopFailed,
//   adminAllOrdersRequest,
//   adminAllOrdersSuccess,
//   adminAllOrdersFailed,
//   clearErrors,
// } = orderSlice.actions;

// export default orderSlice.reducer;















import { createReducer } from "@reduxjs/toolkit"

const initialState = {
  orders: [],
  adminOrders: [],
  isLoading: false,
  adminOrderLoading: false,
  error: null,
  lastUpdated: null,
}

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // User orders
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true
      state.error = null
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false
      state.orders = action.payload || []
      state.lastUpdated = new Date().toISOString()
      state.error = null
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })

    // Shop orders
    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true
      state.error = null
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false
      state.orders = action.payload || []
      state.lastUpdated = new Date().toISOString()
      state.error = null
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })

    // FIXED: Admin orders with proper state updates
    .addCase("adminAllOrdersRequest", (state) => {
      console.log("🔄 Redux: Setting adminOrderLoading to true")
      state.adminOrderLoading = true
      state.error = null
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      console.log("✅ Redux: Admin orders success, payload:", action.payload?.length, "orders")
      state.adminOrderLoading = false
      state.adminOrders = Array.isArray(action.payload) ? action.payload : []
      state.lastUpdated = new Date().toISOString()
      state.error = null
      console.log("📊 Redux: Updated adminOrders state:", state.adminOrders.length, "orders")
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      console.log("❌ Redux: Admin orders failed:", action.payload)
      state.adminOrderLoading = false
      state.adminOrders = []
      state.error = action.payload
    })

    // Clear orders
    .addCase("clearOrders", (state) => {
      state.orders = []
      state.adminOrders = []
      state.error = null
      state.lastUpdated = null
    })
})
