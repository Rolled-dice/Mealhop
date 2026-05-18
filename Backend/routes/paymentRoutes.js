import express from "express";
import { verifyToken } from "../utils/token.js";
import {
  createPaymentIntent,
  verifyPayment,
  getPaymentStatus,
  handleWebhook,
  processCOD,
} from "../controllers/paymentController.js";

const router = express.Router();

// Webhook (must be before express.json middleware for raw body)
// Note: This would need special handling in index.js for raw body
router.post("/webhook", handleWebhook);

// Protected routes
router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/verify", verifyToken, verifyPayment);
router.get("/status/:orderId", verifyToken, getPaymentStatus);
router.post("/cod", verifyToken, processCOD);

export default router;