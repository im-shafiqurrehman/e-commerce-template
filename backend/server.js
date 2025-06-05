import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"
import connectDatabase from "./db/Database.js"
import dotenv from "dotenv"
import { errorHandlerMiddleware } from "./middleware/error.js"
import userRouter from "./routes/userRoute.js"
import shopRouter from "./routes/shopRoute.js"
import productRouter from "./routes/productRoute.js"
import eventRouter from "./routes/eventRoute.js"
import couponsCodeRouter from "./routes/couponsCodeRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import orderRouter from "./routes/orderRoute.js"
import conversationRouter from "./routes/conversationRoute.js"
import messageRouter from "./routes/messagesRoute.js"
import { v2 as cloudinary } from "cloudinary"

// Load environment variables first
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  })
}

console.log("=== Server Configuration ===")
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("PORT:", process.env.PORT)

// Cloudinary Configuration Check
console.log("=== Cloudinary Configuration ===")
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing")
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing")
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing")

// Configure Cloudinary
let cloudinaryConfigured = false
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
    cloudinaryConfigured = true
    console.log("✅ Cloudinary configured successfully")
  } else {
    console.log("❌ Cloudinary configuration failed - missing environment variables")
  }
} catch (error) {
  console.error("❌ Cloudinary configuration error:", error.message)
}

// Test Cloudinary connection
if (cloudinaryConfigured) {
  cloudinary.api
    .ping()
    .then((result) => {
      console.log("✅ Cloudinary connection test successful:", result.status)
    })
    .catch((error) => {
      console.error("❌ Cloudinary connection test failed:", error.message)
    })
}

// Export cloudinary and helper function for use in other files
export { cloudinary }
export const isCloudinaryConfigured = () => {
  return (
    cloudinaryConfigured &&
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

const app = express()

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      process.env.FRONTEND_BASE_URL || "http://localhost:3000",
      "http://localhost:3000",
      "https://accounts.google.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
)

// Add headers to fix cookie and Firebase popup issues
app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "unsafe-none")
  res.header("Cross-Origin-Embedder-Policy", "unsafe-none")
  res.header("Access-Control-Allow-Credentials", "true")

  // Log only API requests to reduce noise
  if (req.path.includes("/api/")) {
    console.log(`${req.method} ${req.path} - Cookies:`, Object.keys(req.cookies || {}))
  }

  next()
})

// Increase payload size limits for base64 images
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(cookieParser())
app.use("/", express.static("uploads"))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))

// Connect to database
connectDatabase()

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running with good health",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cloudinary: {
      configured: isCloudinaryConfigured(),
    },
  })
})

// Cloudinary test endpoint
app.get("/api/test/cloudinary", (req, res) => {
  res.json({
    configured: isCloudinaryConfigured(),
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
    api_key: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
    message: isCloudinaryConfigured() ? "Cloudinary is properly configured" : "Cloudinary configuration is incomplete",
  })
})

// Test upload endpoint
app.post("/api/upload", async (req, res) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ message: "No image provided" })
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Cloudinary not configured",
      })
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "ecommerce",
    })

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    })
  }
})

// API routes
app.use("/api/user", userRouter)
app.use("/api/shop", shopRouter)
app.use("/api/product", productRouter)
app.use("/api/event", eventRouter)
app.use("/api/couponscode", couponsCodeRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/order", orderRouter)
app.use("/api/conversation", conversationRouter)
app.use("/api/message", messageRouter)

// Error handling middleware
app.use(errorHandlerMiddleware)

// Handle 404 for all other routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  })
})

// Unhandled promise rejection handler
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message)
  console.log("🔄 Shutting down the server for unhandled promise rejection")
  process.exit(1)
})

// Start server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log("=== Server Started Successfully ===")
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔧 Cloudinary test: http://localhost:${PORT}/api/test/cloudinary`)
  console.log("=====================================")
})

export default app
