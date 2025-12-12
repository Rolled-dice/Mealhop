import mongoose from "mongoose";
const connectDB = async () => {
  // Database connection logic will go here
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  }
};
export default connectDB;
