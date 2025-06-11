// import { server } from "../../lib/server";
// import axios from "axios";
// import {
//   getAllOrdersUserRequest,
//   getAllOrdersUserSuccess,
//   getAllOrdersUserFailed,
//   getAllOrdersShopRequest,
//   getAllOrdersShopSuccess,
//   getAllOrdersShopFailed
// } from "../reducers/order";

// // get all orders of user
// export const getAllOrdersOfUser = (userId) => async (dispatch) => {
//   try {
//     dispatch(getAllOrdersUserRequest());

//     const { data } = await axios.get(
//       `${server}/order/get-all-orders/${userId}`
//     );

//     dispatch(getAllOrdersUserSuccess(data.orders));
//   } catch (error) {
//     dispatch(getAllOrdersUserFailed(error.response.data.message));
//   }
// };

// // get all orders of shop
// export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
//   try {
//     dispatch(getAllOrdersShopRequest());

//     const { data } = await axios.get(
//       `${server}/order/get-seller-all-orders/${shopId}`
//     );

//     dispatch(getAllOrdersShopSuccess(data.orders));
//   } catch (error) {
//     dispatch(getAllOrdersShopFailed(error.response.data.message));
//   }
// };

// // NEW: Create order action
// export const createOrder = (orderData) => async (dispatch) => {
//   try {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       withCredentials: true,
//     }

//     const { data } = await axios.post(`${server}/order/create-order`, orderData, config)

//     // After creating order, refresh the orders list
//     if (orderData.user?._id) {
//       dispatch(getAllOrdersOfUser(orderData.user._id))
//     }

//     return data
//   } catch (error) {
//     throw error
//   }
// }














import { server } from "../../lib/server"
import axios from "axios"

// get all orders of user - KEEPING EXISTING FUNCTION NAME
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersUserRequest" })

    const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`)

    dispatch({ type: "getAllOrdersUserSuccess", payload: data.orders })
  } catch (error) {
    dispatch({ type: "getAllOrdersUserFailed", payload: error.response?.data?.message || "Failed to fetch orders" })
  }
}

// get all orders of shop - KEEPING EXISTING FUNCTION NAME
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersShopRequest" })

    const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`)

    dispatch({ type: "getAllOrdersShopSuccess", payload: data.orders })
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response?.data?.message || "Failed to fetch shop orders",
    })
  }
}

// FIXED: Get all Orders of Admin - simplified and fixed
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "adminAllOrdersRequest" })

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (data.success && Array.isArray(data.orders)) {
      dispatch({ type: "adminAllOrdersSuccess", payload: data.orders })

      // Return the orders for immediate use if needed
      return data.orders
    } else {
      console.error(" Invalid response format:", data)
      throw new Error("Invalid response format")
    }
  } catch (error) {
    console.error(" Admin orders fetch error:", error)
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch admin orders"

    dispatch({
      type: "adminAllOrdersFailed",
      payload: errorMessage,
    })

    // Return empty array on error
    return []
  }
}
