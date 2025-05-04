import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import shopModel from "../model/shopModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log("Token:", token); // Debug

  if (!token) {
    return next(new ErrorHandler("UnAuthorized User", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded:", decoded); // Debug
  } catch (jwtError) {
    console.error("JWT Verification Error:", jwtError.message);
    return next(new ErrorHandler("Invalid token", 401));
  }

  req.user = await userModel.findById(decoded.id);
  console.log("User:", req.user); // Debug

  if (!req.user) {
    return next(new ErrorHandler("User not found", 404));
  }

  next();
});


export const isAdmin = catchAsyncErrors(async (req, res, next) => {
  console.log("req.user:", req.user);
  if (!req.user || req.user.role !== "admin") {
    return next(new ErrorHandler("Admin access only", 403));
  }
  next();
});



export const isSeller = catchAsyncErrors(async (req, res, next) => {
  const { seller_token } = req.cookies;

  if (!seller_token) {
    return next(new ErrorHandler("UnAuthorized User", 401));
  }

  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

  req.seller = await shopModel.findById(decoded.id);
  
  if (!req.seller) {
    return next(new ErrorHandler("Seller not found", 401));
  }

  // console.log('Seller Middleware - Seller:', req.seller);

  next();
});