import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: String,
  isAvailable: { type: Boolean, default: true },
});

const restaurantSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  cuisine: [String],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  phone: String,
  email: String,
  image: String,
  menu: [menuItemSchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  openingTime: String,
  closingTime: String,
  deliveryFee: {
    type: Number,
    default: 30,
  },
  minimumOrder: {
    type: Number,
    default: 100,
  },
  deliveryTime: {
    type: String,
    default: "30-45 min",
  },
}, { timestamps: true });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);