import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authrouter from "./routes/userAuthRoutes.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import restaurantRouter from "./routes/restaurantRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:4321", "http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use("/api/auth", authrouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/orders", orderRouter);
app.use("/api/owner", ownerRouter);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

export default app;
