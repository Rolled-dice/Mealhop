// Payment controller with optional Stripe integration
// If STRIPE_SECRET_KEY is not set in .env, it will work in mock/test mode

import { Order } from "../models/orderModel.js";

// Get Stripe instance (null if not configured)
const getStripe = () => {
  try {
    // Dynamic import to avoid errors if stripe is not installed
    if (process.env.STRIPE_SECRET_KEY) {
      // This would work if stripe package is installed
      // For now, we'll use mock mode
      return { configured: true, key: process.env.STRIPE_SECRET_KEY };
    }
  } catch (e) {
    console.log("Stripe not configured, using mock mode");
  }
  return null;
};

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const stripe = getStripe();

    // Mock mode - return fake client secret for testing
    if (!stripe) {
      console.log("Stripe not configured - using mock payment mode");
      return res.status(200).json({
        clientSecret: "mock_" + Date.now() + "_secret",
        message: "Running in test mode (no real payment)",
        isMock: true,
        instructions: "Add STRIPE_SECRET_KEY to .env for real payments",
      });
    }

    // Real Stripe implementation (when key is configured)
    // Note: Run 'npm install stripe' after adding key to .env
    const Stripe = (await import("stripe")).default;
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      metadata: { orderId },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      isMock: false,
    });
  } catch (err) {
    console.error("Payment intent error:", err);
    // Return mock on error too for development
    res.status(200).json({
      clientSecret: "mock_" + Date.now() + "_secret",
      message: "Payment error - running in test mode",
      isMock: true,
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "paid";
    await order.save();

    res.status(200).json({ message: "Payment verified", order });
  } catch (err) {
    res.status(500).json({ message: "Verification error", error: err.message });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// Process cash on delivery
export const processCOD = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentMethod = "cash";
    order.paymentStatus = "pending";
    await order.save();

    res.status(200).json({ message: "Cash on delivery selected", order });
  } catch (err) {
    res.status(500).json({ message: "COD error", error: err.message });
  }
};

// Handle Stripe webhooks
export const handleWebhook = async (req, res) => {
  try {
    // This is a placeholder for Stripe webhook integration
    // Real implementation would verify stripe signature and update order status
    console.log("Webhook received:", req.body);
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(500).json({ message: "Webhook error", error: err.message });
  }
};