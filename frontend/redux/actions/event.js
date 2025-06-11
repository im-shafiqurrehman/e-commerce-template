// import axios from "axios";
// import { server } from "../../lib/server";
// import {
//   createEventFail,
//   createEventRequest,
//   createEventSuccess,
//   deleteEventFailed,
//   deleteEventRequest,
//   deleteEventSuccess,
//   getAlleventsFailed,
//   getAlleventsRequest,
//   getAllEventsShopFailed,
//   getAllEventsShopRequest,
//   getAllEventsShopSuccess,
//   getAlleventsSuccess,
// } from "../reducers/event";

// // create event
// export const createEvent = (formData) => async (dispatch) => {
//   try {
//     dispatch(createEventRequest());

//     const { data } = await axios.post(
//       `${server}/event/create-event`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true,
//       },
//     );

//     dispatch(createEventSuccess(data.event));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || "An error occurred";
//     dispatch(createEventFail(errorMessage));
//   }
// };

// // Action to get all event for a shop
// export const getAllShopEvents = (id) => async (dispatch) => {
//   try {
//     dispatch(getAllEventsShopRequest());

//     const { data } = await axios.get(
//       `${server}/event/get-all-shop-events/${id}`,
//     );

//     dispatch(getAllEventsShopSuccess(data.events));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || "An error occurred";
//     dispatch(getAllEventsShopFailed(errorMessage));
//   }
// };

// // Action to delete event for a shop
// export const deleteShopEvent = (id) => async (dispatch) => {
//   try {
//     dispatch(deleteEventRequest());

//     const { data } = await axios.delete(
//       `${server}/event/delete-shop-event/${id}`,
//       { withCredentials: true },
//     );

//     dispatch(deleteEventSuccess(data.message));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || "An error occurred";
//     dispatch(deleteEventFailed(errorMessage));
//   }
// };

// // Action to get all event
// export const getAllEvents = () => async (dispatch) => {
//   try {
//     dispatch(getAlleventsRequest());

//     const { data } = await axios.get(`${server}/event/get-all-events`);

//     dispatch(getAlleventsSuccess(data.events));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || "An error occurred";
//     dispatch(getAlleventsFailed(errorMessage));
//   }
// };



























import axios from "axios"
import { server } from "../../lib/server"
import {
  createEventFail,
  createEventRequest,
  createEventSuccess,
  deleteEventFailed,
  deleteEventRequest,
  deleteEventSuccess,
  getAlleventsFailed,
  getAlleventsRequest,
  getAllEventsShopFailed,
  getAllEventsShopRequest,
  getAllEventsShopSuccess,
  getAlleventsSuccess,
  adminAllEventsRequest,
  adminAllEventsSuccess,
  adminAllEventsFailed,
} from "../reducers/event"

// create event
export const createEvent = (formData) => async (dispatch) => {
  try {
    dispatch(createEventRequest())

    const { data } = await axios.post(`${server}/event/create-event`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })

    dispatch(createEventSuccess(data.event))
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred"
    dispatch(createEventFail(errorMessage))
  }
}

// Action to get all event for a shop
export const getAllShopEvents = (id) => async (dispatch) => {
  try {
    dispatch(getAllEventsShopRequest())

    const { data } = await axios.get(`${server}/event/get-all-shop-events/${id}`)

    dispatch(getAllEventsShopSuccess(data.events))
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred"
    dispatch(getAllEventsShopFailed(errorMessage))
  }
}

// Action to delete event for a shop
export const deleteShopEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteEventRequest())

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, { withCredentials: true })

    dispatch(deleteEventSuccess(data.message))
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred"
    dispatch(deleteEventFailed(errorMessage))
  }
}

// Action to get all event
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch(getAlleventsRequest())

    const { data } = await axios.get(`${server}/event/get-all-events`)

    dispatch(getAlleventsSuccess(data.events))
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred"
    dispatch(getAlleventsFailed(errorMessage))
  }
}

// FIXED: Get all events for admin
export const getAllEventsAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllEventsRequest())

    const { data } = await axios.get(`${server}/event/admin-all-events`, {
      withCredentials: true,
    })

    dispatch(adminAllEventsSuccess(data.events))
    return data.events
  } catch (error) {
    console.error("Admin events fetch error:", error)
    dispatch(adminAllEventsFailed(error.response?.data?.message || "Failed to fetch admin events"))
    return []
  }
}
