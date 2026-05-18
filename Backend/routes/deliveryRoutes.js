import express from "express";
import { verifyToken } from "../utils/token.js";
import {
  getAvailableOrders,
  acceptOrder,
  getMyOrders,
  updateDeliveryStatus,
  getDeliveryEarnings,
} from "../controllers/deliveryController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get available orders (for delivery boys)
router.get("/orders/available", getAvailableOrders);

// Accept an order
router.post("/orders/:orderId/accept", acceptOrder);

// Get my assigned orders
router.get("/orders/my", getMyOrders);

// Update delivery status
router.patch("/orders/:orderId/status", updateDeliveryStatus);

// Get earnings
router.get("/earnings", getDeliveryEarnings);

export default router;