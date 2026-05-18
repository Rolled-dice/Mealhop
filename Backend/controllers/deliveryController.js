import { Order } from "../models/orderModel.js";

// Get available orders (orders that need delivery)
export const getAvailableOrders = async (req, res) => {
  try {
    // Only delivery boys can access this
    if (req.userRole !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied. Delivery boy only." });
    }

    const orders = await Order.find({
      status: { $in: ["ready", "accepted"] },
      deliveryBoyId: null,
    })
      .populate("userId", "Fullname PhoneNumber")
      .populate("restaurantId", "name address")
      .sort({ placedAt: -1 })
      .limit(50);

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Accept an order for delivery
export const acceptOrder = async (req, res) => {
  try {
    if (req.userRole !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied. Delivery boy only." });
    }

    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryBoyId) {
      return res.status(400).json({ message: "Order already assigned to another delivery boy" });
    }

    order.deliveryBoyId = req.userId;
    order.status = "picked_up";
    order.acceptedAt = new Date();

    await order.save();

    res.status(200).json({ message: "Order accepted", order });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get my assigned orders
export const getMyOrders = async (req, res) => {
  try {
    if (req.userRole !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied. Delivery boy only." });
    }

    const { status } = req.query;
    const query = { deliveryBoyId: req.userId };
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("userId", "Fullname PhoneNumber deliveryAddress")
      .populate("restaurantId", "name address phone")
      .sort({ placedAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  try {
    if (req.userRole !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied. Delivery boy only." });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["picked_up", "delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryBoyId?.toString() !== req.userId) {
      return res.status(403).json({ message: "This order is not assigned to you" });
    }

    order.status = status;

    if (status === "picked_up") {
      order.pickedUpAt = new Date();
    } else if (status === "delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "paid";
    }

    await order.save();

    res.status(200).json({ message: "Status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Get earnings
export const getDeliveryEarnings = async (req, res) => {
  try {
    if (req.userRole !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied. Delivery boy only." });
    }

    const { period } = req.query; // 'today', 'week', 'month', 'all'
    
    let startDate = new Date(0);
    const now = new Date();

    if (period === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === "week") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === "month") {
      startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const orders = await Order.find({
      deliveryBoyId: req.userId,
      status: "delivered",
      deliveredAt: { $gte: startDate },
    });

    const totalEarnings = orders.reduce((sum, order) => sum + (order.deliveryFee || 30), 0);
    const totalDeliveries = orders.length;

    res.status(200).json({
      totalEarnings,
      totalDeliveries,
      period: period || "all",
      orders: orders.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};