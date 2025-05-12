// import express from "express";
// import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import cors from "cors";
// import connectDatabase from "./db/Database.js";
// import dotenv from "dotenv";
// import { errorHandlerMiddleware } from "./middleware/error.js";
// import userRouter from "./routes/userRoute.js";
// import shopRouter from "./routes/shopRoute.js";
// import productRouter from "./routes/productRoute.js";
// import eventRouter from "./routes/eventRoute.js";
// import couponsCodeRouter from "./routes/couponsCodeRoute.js";
// import paymentRouter from "./routes/paymentRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import conversationRouter from "./routes/conversationRoute.js";
// import messageRouter from "./routes/messagesRoute.js";

// // config
// const app = express();
// if (process.env.NODE_ENV !== "PRODUCTION") {
//   dotenv.config({
//     path: "config/.env",
//   });
// }

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(cookieParser());
// app.use("/", express.static("uploads"));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// connectDatabase();

// // import routes
// app.use("/api/user", userRouter);
// app.use("/api/shop", shopRouter);
// app.use("/api/product", productRouter);
// app.use("/api/event", eventRouter);
// app.use("/api/couponscode", couponsCodeRouter);
// app.use("/api/payment", paymentRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/conversation", conversationRouter);
// app.use("/api/message", messageRouter);

// app.use("/health", (req, res) => {
//   res.send("Server is running with good health");
// });
// // unhandled promise rejection
// process.on("unhandledRejection", (err) => {
//   console.log(`Shutting down the server for ${err.message}`);
//   console.log(`shutting down the server for unhandled promise rejection`);
// });

// // Error handling middleware
// app.use(errorHandlerMiddleware);

// // create server
// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });



// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });


// // ADD THIS AT THE END INSTEAD OF app.listen()
// export default app;



import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDatabase from "./db/Database.js";
import dotenv from "dotenv";
import { errorHandlerMiddleware } from "./middleware/error.js";
import userRouter from "./routes/userRoute.js";
import shopRouter from "./routes/shopRoute.js";
import productRouter from "./routes/productRoute.js";
import eventRouter from "./routes/eventRoute.js";
import couponsCodeRouter from "./routes/couponsCodeRoute.js";
import paymentRouter from "./routes/paymentRoute.js";
import orderRouter from "./routes/orderRoute.js";
import conversationRouter from "./routes/conversationRoute.js";
import messageRouter from "./routes/messagesRoute.js";

// Load env variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/.env" });
}

// Initialize app
const app = express();

// Connect database
connectDatabase();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/product", productRouter);
app.use("/api/event", eventRouter);
app.use("/api/couponscode", couponsCodeRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);

app.use("/health", (req, res) => {
  res.send("Server is running with good health");
});

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Middleware
app.use(errorHandlerMiddleware);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});


// ✅ IMPORTANT: Do NOT call app.listen() on Vercel
// ❌ Do NOT use: app.listen(process.env.PORT)
// ✅ Instead, export the app for serverless handling
export default app;

