import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deliveryBoyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  restaurantAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "preparing", "ready", "picked_up", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cash", "wallet"],
    default: "cash",
  },
  deliveryFee: {
    type: Number,
    default: 30,
  },
  deliveryOtp: {
    type: String,
    default: () => Math.floor(1000 + Math.random() * 9000).toString(),
  },
  placedAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: Date,
  preparedAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);