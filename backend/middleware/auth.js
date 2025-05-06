import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import shopModel from "../model/shopModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Get token from multiple possible sources
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null)

  // console.log("Auth Middleware - Token Source:", {
  //   fromCookies: !!req.cookies.token,
  //   fromAuthHeader: !!(req.headers.authorization && req.headers.authorization.startsWith("Bearer")),
  //   finalToken: token,
  // })

  if (!token) {
    return next(new ErrorHandler("UnAuthorized User", 401))
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
  } catch (jwtError) {
    return next(new ErrorHandler("Invalid token", 401))
  }

  const user = await userModel.findById(decoded.id)

  if (!user) {
    return next(new ErrorHandler("User not found", 404))
  }

  req.user = user

  next()
})

export const isAdmin = catchAsyncErrors(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401))
  }

  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Admin access only", 403))
  }
  next()
})



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

  next();
});