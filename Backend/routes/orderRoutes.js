import express from "express";
import { verifyToken } from "../utils/token.js";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getOwnerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();
router.use(verifyToken);

// Customer
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);

// Owner
router.get("/owner/all", getOwnerOrders);
router.patch("/:id/status", updateOrderStatus);

export default router;
