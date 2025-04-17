import express from "express";
import multer from "multer";
import {
  activateSellerShop,
  createShop,
  loadShop,
  logout,
  shopLogin,
  getShopInfo,
  updateShopAvatar,
  updateSellerInfo
} from "../controller/shopController.js";
import { isSeller } from "../middleware/auth.js";

const shopRouter = express.Router();

// Image upload engine
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

shopRouter.post("/create-shop", upload.single("file"), createShop);
shopRouter.post("/seller/activation", activateSellerShop);
shopRouter.post("/login-shop", shopLogin);
shopRouter.get("/getSeller", isSeller, loadShop);
shopRouter.get("/logout", isSeller, logout);
shopRouter.get("/get-shop-info/:id", getShopInfo);
shopRouter.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("file"),
  updateShopAvatar
);
shopRouter.put("/update-seller-info",isSeller, updateSellerInfo);

export default shopRouter;
