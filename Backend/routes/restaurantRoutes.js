import express from "express";
import { verifyToken } from "../utils/token.js";
import {
  getAllRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/restaurantController.js";

const router = express.Router();

// Public
router.get("/", getAllRestaurants);

// Owner routes (must be before /:id)
router.get("/owner/me", verifyToken, getMyRestaurant);
router.post("/", verifyToken, createRestaurant);
router.put("/", verifyToken, updateRestaurant);
router.post("/menu", verifyToken, addMenuItem);
router.put("/menu/:itemId", verifyToken, updateMenuItem);
router.delete("/menu/:itemId", verifyToken, deleteMenuItem);

// Parameterized route last
router.get("/:id", getRestaurantById);

export default router;
