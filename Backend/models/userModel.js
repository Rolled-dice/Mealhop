import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Fullname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "owner", "deliveryBoy"],
  },
});

export const User = mongoose.model("User", userSchema);
