import { server } from "../../lib/server";
import axios from "axios";
import {
  getAllOrdersUserRequest,
  getAllOrdersUserSuccess,
  getAllOrdersUserFailed,
  getAllOrdersShopRequest,
  getAllOrdersShopSuccess,
  getAllOrdersShopFailed
} from "../reducers/order";

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersUserRequest());

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );

    dispatch(getAllOrdersUserSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersUserFailed(error.response.data.message));
  }
};

// get all orders of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch(getAllOrdersShopRequest());

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${shopId}`
    );

    dispatch(getAllOrdersShopSuccess(data.orders));
  } catch (error) {
    dispatch(getAllOrdersShopFailed(error.response.data.message));
  }
};