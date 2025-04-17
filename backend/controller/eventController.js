import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import eventModel from "../model/eventModel.js";
import shopModel from "../model/shopModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// create event
export const createEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const { shopId } = req.body;
    console.log("Received Shop ID:", shopId);
    const shop = await shopModel.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Invalid shop Id", 400));
    }

    const files = req.files;
    const imageUrls = files.map((file) => `${file.filename}`);

    const eventData = {
      ...req.body,
      images: imageUrls,
      shop: shop._id,
    };

    console.log(eventData);

    const event = await eventModel.create(eventData);

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all shop events
export const getAllShopEvents = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await eventModel.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// delete event route
export const deleteEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const eventId = req.params.id;

    const event = await eventModel.findByIdAndDelete(eventId);

    if (!event) {
      return next(new ErrorHandler("Event not found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all events
export const getAllEvents = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await eventModel.find();
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 404));
  }
});
