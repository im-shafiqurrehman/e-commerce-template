import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";
import shopModel from "../model/shopModel.js";
import admin from "firebase-admin"




// Initialize Firebase Admin if not already initialized
let firebaseInitialized = false

const initializeFirebase = () => {
  try {
    // Check if all required Firebase environment variables are present
    const requiredVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_PRIVATE_KEY_ID",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_CLIENT_ID",
    ]

    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length > 0) {
      console.log(`⚠️  Firebase Admin SDK not initialized. Missing environment variables: ${missingVars.join(", ")}`)
      console.log("🔧 Google authentication will not work until these are configured.")
      return false
    }

    if (!admin.apps.length) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })

      console.log("✅ Firebase Admin SDK initialized successfully")
      firebaseInitialized = true
      return true
    }
    return true
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error.message)
    console.log("🔧 Traditional JWT authentication will still work.")
    return false
  }
}

// Try to initialize Firebase on startup
firebaseInitialized = initializeFirebase()

// Enhanced isAuthenticated middleware that supports both JWT and Firebase tokens
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Get token from multiple possible sources
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null)

  if (!token) {
    return next(new ErrorHandler("UnAuthorized User", 401))
  }

  // First try to verify as Firebase token (only if Firebase is initialized)
  if (firebaseInitialized && admin.apps.length) {
    try {
      const decodedFirebase = await admin.auth().verifyIdToken(token)

      // Check if user exists in database
      let user = await userModel.findOne({
        $or: [{ firebaseUid: decodedFirebase.uid }, { email: decodedFirebase.email }],
      })

      // If user doesn't exist, create a new one
      if (!user) {
        user = await userModel.create({
          name: decodedFirebase.name || decodedFirebase.email?.split("@")[0] || "User",
          email: decodedFirebase.email,
          firebaseUid: decodedFirebase.uid,
          avatar: decodedFirebase.picture || "/assets/user.png",
          isEmailVerified: decodedFirebase.email_verified,
          authProvider: "google",
        })
      }

      req.user = user
      return next()
    } catch (firebaseError) {
      // Firebase token verification failed, try JWT
      console.log("Firebase token verification failed, trying JWT...")
    }
  }

  // Try JWT verification
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await userModel.findById(decoded.id)

    if (!user) {
      return next(new ErrorHandler("User not found", 404))
    }

    req.user = user
    return next()
  } catch (jwtError) {
    return next(new ErrorHandler("Invalid token", 401))
  }
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