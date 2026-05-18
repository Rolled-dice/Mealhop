dotenv.config();
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authrouter from "./routes/userAuthRoutes.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();
app.use(express.json()); // for the body pasrer.
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authrouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
