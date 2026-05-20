import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/userModel.js";
import { Restaurant } from "./models/restaurantModel.js";
import { Order } from "./models/orderModel.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to MongoDB");

  // Check if data already exists
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    console.log(`Database already has ${userCount} users. Skipping seed.`);
    console.log("Run with --force to reset: node seed.js --force");
    if (!process.argv.includes("--force")) {
      await mongoose.disconnect();
      return;
    }
    console.log("--force flag detected. Resetting database...");
  }

  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Order.deleteMany({});
  console.log("Cleared existing data");

  const pass = bcrypt.hashSync("Password@123", 10);

  const users = await User.insertMany([
    { Fullname: "Rahul Sharma", Email: "rahul@mealhop.com", password: pass, PhoneNumber: "9876543210", role: "user" },
    { Fullname: "Priya Patel", Email: "priya@mealhop.com", password: pass, PhoneNumber: "9876543211", role: "user" },
    { Fullname: "Amit Kumar", Email: "amit@mealhop.com", password: pass, PhoneNumber: "9876543212", role: "user" },
    { Fullname: "Spice Garden Owner", Email: "spicegarden@mealhop.com", password: pass, PhoneNumber: "9876543220", role: "owner" },
    { Fullname: "Pizza Palace Owner", Email: "pizzapalace@mealhop.com", password: pass, PhoneNumber: "9876543221", role: "owner" },
    { Fullname: "Dragon Wok Owner", Email: "dragonwok@mealhop.com", password: pass, PhoneNumber: "9876543222", role: "owner" },
    { Fullname: "Ravi Delivery", Email: "ravi@mealhop.com", password: pass, PhoneNumber: "9876543230", role: "deliveryBoy" },
    { Fullname: "Suresh Delivery", Email: "suresh@mealhop.com", password: pass, PhoneNumber: "9876543231", role: "deliveryBoy" },
  ]);
  console.log(`Created ${users.length} users`);

  const [rahul, priya, amit, owner1, owner2, owner3, delivery1, delivery2] = users;

  const restaurants = await Restaurant.insertMany([
    {
      ownerId: owner1._id,
      name: "Spice Garden",
      description: "Authentic North Indian cuisine with rich flavors and aromatic spices",
      cuisine: ["Indian", "North Indian", "Mughlai"],
      address: { street: "45 MG Road", city: "Delhi", state: "Delhi", zipCode: "110001" },
      phone: "011-23456789",
      rating: 4.5,
      reviewCount: 128,
      isOpen: true,
      deliveryTime: "30-40 min",
      deliveryFee: 30,
      minimumOrder: 150,
      menu: [
        { name: "Butter Chicken", description: "Creamy tomato-based curry with tender chicken", price: 320, category: "main", isAvailable: true },
        { name: "Dal Makhani", description: "Slow-cooked black lentils in butter and cream", price: 220, category: "main", isAvailable: true },
        { name: "Garlic Naan", description: "Freshly baked naan with garlic butter", price: 60, category: "appetizer", isAvailable: true },
        { name: "Paneer Tikka", description: "Grilled cottage cheese with spices", price: 250, category: "appetizer", isAvailable: true },
        { name: "Biryani", description: "Fragrant basmati rice with spiced chicken", price: 350, category: "main", isAvailable: true },
        { name: "Gulab Jamun", description: "Deep-fried milk dumplings in sugar syrup", price: 120, category: "dessert", isAvailable: true },
        { name: "Mango Lassi", description: "Refreshing yogurt drink with mango", price: 90, category: "beverage", isAvailable: true },
      ],
    },
    {
      ownerId: owner2._id,
      name: "Pizza Palace",
      description: "Wood-fired pizzas and Italian favorites made with imported ingredients",
      cuisine: ["Italian", "Pizza", "Pasta"],
      address: { street: "12 Brigade Road", city: "Bangalore", state: "Karnataka", zipCode: "560001" },
      phone: "080-34567890",
      rating: 4.2,
      reviewCount: 95,
      isOpen: true,
      deliveryTime: "25-35 min",
      deliveryFee: 40,
      minimumOrder: 200,
      menu: [
        { name: "Margherita Pizza", description: "Classic tomato, mozzarella, and basil", price: 299, category: "main", isAvailable: true },
        { name: "Pepperoni Pizza", description: "Loaded with spicy pepperoni and cheese", price: 399, category: "main", isAvailable: true },
        { name: "Garlic Bread", description: "Crispy bread with garlic butter and herbs", price: 149, category: "appetizer", isAvailable: true },
        { name: "Pasta Alfredo", description: "Creamy white sauce pasta with mushrooms", price: 279, category: "main", isAvailable: true },
        { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 199, category: "dessert", isAvailable: true },
        { name: "Cold Coffee", description: "Iced coffee with whipped cream", price: 129, category: "beverage", isAvailable: true },
      ],
    },
    {
      ownerId: owner3._id,
      name: "Dragon Wok",
      description: "Authentic Chinese and Pan-Asian street food with bold flavors",
      cuisine: ["Chinese", "Asian", "Thai"],
      address: { street: "78 Park Street", city: "Kolkata", state: "West Bengal", zipCode: "700016" },
      phone: "033-45678901",
      rating: 4.0,
      reviewCount: 67,
      isOpen: true,
      deliveryTime: "35-45 min",
      deliveryFee: 35,
      minimumOrder: 180,
      menu: [
        { name: "Chicken Manchurian", description: "Indo-Chinese crispy chicken in tangy sauce", price: 280, category: "main", isAvailable: true },
        { name: "Veg Fried Rice", description: "Wok-tossed rice with fresh vegetables", price: 180, category: "main", isAvailable: true },
        { name: "Spring Rolls", description: "Crispy rolls stuffed with vegetables", price: 150, category: "appetizer", isAvailable: true },
        { name: "Hakka Noodles", description: "Stir-fried noodles with vegetables and soy", price: 200, category: "main", isAvailable: true },
        { name: "Dim Sum", description: "Steamed dumplings with chicken filling", price: 220, category: "appetizer", isAvailable: true },
        { name: "Green Tea", description: "Freshly brewed Japanese green tea", price: 80, category: "beverage", isAvailable: true },
      ],
    },
  ]);
  console.log(`Created ${restaurants.length} restaurants`);

  const orders = await Order.insertMany([
    {
      userId: rahul._id,
      restaurantId: restaurants[0]._id,
      items: [{ name: "Butter Chicken", price: 320, quantity: 1 }, { name: "Garlic Naan", price: 60, quantity: 2 }],
      totalAmount: 470,
      deliveryAddress: { street: "22 Lajpat Nagar", city: "Delhi", state: "Delhi" },
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "card",
      deliveryBoyId: delivery1._id,
      deliveredAt: new Date(Date.now() - 86400000),
    },
    {
      userId: priya._id,
      restaurantId: restaurants[1]._id,
      items: [{ name: "Pepperoni Pizza", price: 399, quantity: 1 }, { name: "Cold Coffee", price: 129, quantity: 2 }],
      totalAmount: 697,
      deliveryAddress: { street: "5 Koramangala", city: "Bangalore", state: "Karnataka" },
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "card",
      deliveryBoyId: delivery2._id,
      deliveredAt: new Date(Date.now() - 43200000),
    },
    {
      userId: amit._id,
      restaurantId: restaurants[2]._id,
      items: [{ name: "Chicken Manchurian", price: 280, quantity: 1 }, { name: "Hakka Noodles", price: 200, quantity: 1 }],
      totalAmount: 515,
      deliveryAddress: { street: "10 Salt Lake", city: "Kolkata", state: "West Bengal" },
      status: "preparing",
      paymentStatus: "paid",
      paymentMethod: "card",
    },
    {
      userId: rahul._id,
      restaurantId: restaurants[0]._id,
      items: [{ name: "Biryani", price: 350, quantity: 2 }, { name: "Mango Lassi", price: 90, quantity: 2 }],
      totalAmount: 910,
      deliveryAddress: { street: "22 Lajpat Nagar", city: "Delhi", state: "Delhi" },
      status: "pending",
      paymentStatus: "paid",
      paymentMethod: "cash",
    },
    {
      userId: priya._id,
      restaurantId: restaurants[0]._id,
      items: [{ name: "Paneer Tikka", price: 250, quantity: 1 }, { name: "Dal Makhani", price: 220, quantity: 1 }],
      totalAmount: 500,
      deliveryAddress: { street: "5 Koramangala", city: "Bangalore", state: "Karnataka" },
      status: "ready",
      paymentStatus: "paid",
      paymentMethod: "card",
    },
    {
      userId: amit._id,
      restaurantId: restaurants[1]._id,
      items: [{ name: "Margherita Pizza", price: 299, quantity: 2 }, { name: "Garlic Bread", price: 149, quantity: 1 }],
      totalAmount: 787,
      deliveryAddress: { street: "10 Salt Lake", city: "Kolkata", state: "West Bengal" },
      status: "delivered",
      paymentStatus: "paid",
      paymentMethod: "card",
      deliveryBoyId: delivery1._id,
      deliveredAt: new Date(Date.now() - 7200000),
    },
  ]);
  console.log(`Created ${orders.length} orders`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📋 Login credentials (all passwords: Password@123):");
  console.log("   Customers: rahul@mealhop.com, priya@mealhop.com, amit@mealhop.com");
  console.log("   Owners: spicegarden@mealhop.com, pizzapalace@mealhop.com, dragonwok@mealhop.com");
  console.log("   Delivery: ravi@mealhop.com, suresh@mealhop.com");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
