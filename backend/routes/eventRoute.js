import express from "express";
import multer from "multer";
import {
  createEvent,
  getAllShopEvents,
  deleteEvent,
  getAllEvents,
} from "../controller/eventController.js";
import { isSeller } from "../middleware/auth.js";

const eventRouter = express.Router();

// image upload engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// event routes
eventRouter.post("/create-event", upload.array("images"), createEvent);
eventRouter.get("/get-all-shop-events/:id", getAllShopEvents);
eventRouter.delete("/delete-shop-event/:id", isSeller, deleteEvent);
eventRouter.get("/get-all-events/", getAllEvents);

export default eventRouter;
