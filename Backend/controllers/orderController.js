import { Order } from "../models/orderModel.js";
import { Restaurant } from "../models/restaurantModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0) + (restaurant.deliveryFee || 30);

    const order = new Order({
      userId: req.userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      restaurantAddress: restaurant.address,
      paymentMethod: paymentMethod || "cash",
      deliveryFee: restaurant.deliveryFee || 30,
    });

    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("restaurantId", "name image")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurantId", "name address phone")
      .populate("userId", "Fullname PhoneNumber");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getOwnerOrders = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });

    const { status } = req.query;
    const filter = { restaurantId: restaurant._id };
    if (status && status !== "all") filter.status = status;

    const orders = await Order.find(filter)
      .populate("userId", "Fullname PhoneNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const { status } = req.body;
    const validStatuses = ["accepted", "preparing", "ready", "cancelled"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    if (status === "accepted") order.acceptedAt = new Date();
    if (status === "ready") order.preparedAt = new Date();
    await order.save();

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
