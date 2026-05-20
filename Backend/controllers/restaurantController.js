import { Restaurant } from "../models/restaurantModel.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const { cuisine, search } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = cuisine;
    if (search) filter.name = { $regex: search, $options: "i" };

    const restaurants = await Restaurant.find(filter).select("-menu");
    res.status(200).json({ restaurants });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getMyRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found. Create one first." });
    res.status(200).json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const existing = await Restaurant.findOne({ ownerId: req.userId });
    if (existing) return res.status(400).json({ message: "You already have a restaurant" });

    const restaurant = new Restaurant({ ...req.body, ownerId: req.userId });
    await restaurant.save();
    res.status(201).json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const restaurant = await Restaurant.findOneAndUpdate(
      { ownerId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.status(200).json({ restaurant });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.menu.push(req.body);
    await restaurant.save();

    const newItem = restaurant.menu[restaurant.menu.length - 1];
    res.status(201).json({ item: newItem });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    Object.assign(item, req.body);
    await restaurant.save();
    res.status(200).json({ item });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.menu.pull({ _id: req.params.itemId });
    await restaurant.save();
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
