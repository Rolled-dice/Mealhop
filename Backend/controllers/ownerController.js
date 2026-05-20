import { Order } from "../models/orderModel.js";
import { Restaurant } from "../models/restaurantModel.js";

export const getAnalytics = async (req, res) => {
  try {
    if (req.userRole !== "owner") return res.status(403).json({ message: "Owners only" });

    const restaurant = await Restaurant.findOne({ ownerId: req.userId });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const allOrders = await Order.find({ restaurantId: restaurant._id });
    const deliveredOrders = allOrders.filter(o => o.status === "delivered");

    const todayOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfToday);
    const weekOrders = allOrders.filter(o => new Date(o.createdAt) >= startOfWeek);

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const todayRevenue = todayOrders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.totalAmount, 0);
    const weekRevenue = weekOrders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.totalAmount, 0);

    // Top items
    const itemCounts = {};
    deliveredOrders.forEach(o => {
      o.items.forEach(i => {
        itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
    });
    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.status(200).json({
      totalOrders: allOrders.length,
      deliveredOrders: deliveredOrders.length,
      pendingOrders: allOrders.filter(o => o.status === "pending").length,
      cancelledOrders: allOrders.filter(o => o.status === "cancelled").length,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      todayOrders: todayOrders.length,
      averageOrderValue: deliveredOrders.length ? Math.round(totalRevenue / deliveredOrders.length) : 0,
      topItems,
      rating: restaurant.rating,
      reviewCount: restaurant.reviewCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
