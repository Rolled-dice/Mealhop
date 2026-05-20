import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiLogOut, FiShoppingBag, FiMapPin, FiTrendingUp, FiSettings, FiList, FiPieChart } from "react-icons/fi";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.log("Not authenticated:", error);
      window.location.href = "/signin";
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      window.location.href = "/signin";
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const navigate = (path) => {
    window.location.href = path;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-500 font-medium animate-pulse">Loading MealHop...</p>
        </div>
      </div>
    );
  }

  const role = user?.role;

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-3xl">🍔</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              MealHop
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">Welcome, {user?.Fullname || user?.email}</span>
              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-semibold uppercase tracking-wider">
                {role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-300 shadow-sm"
            >
              <FiLogOut className="group-hover:translate-x-1 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center sm:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Hello, <span className="text-orange-500">{user?.Fullname || 'Foodie'}</span>!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            {role === 'user' && "Hungry? Discover the best meals from your favorite local restaurants."}
            {role === 'deliveryBoy' && "Ready for your next delivery? Check available orders and start earning."}
            {role === 'owner' && "Manage your restaurant, update the menu, and track your orders."}
          </p>
        </div>

        {/* User Dashboard */}
        {role === "user" && (
          <div className="grid md:grid-cols-3 gap-8">
            <DashboardCard 
              title="Browse Restaurants"
              desc="Explore curated menus from the best local eateries"
              icon={<FiShoppingBag className="text-blue-500" />}
              onClick={() => navigate("/restaurants")}
              color="bg-blue-50"
            />
            <DashboardCard 
              title="My Orders"
              desc="Track your active orders and view past history"
              icon={<FiList className="text-purple-500" />}
              onClick={() => navigate("/orders")}
              color="bg-purple-50"
            />
            <DashboardCard 
              title="Payment Methods"
              desc="Manage your cards and secure checkout options"
              icon={<FiSettings className="text-green-500" />}
              onClick={() => navigate("/payment")}
              color="bg-green-50"
            />
          </div>
        )}

        {/* Delivery Agent Dashboard */}
        {role === "deliveryBoy" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Available Orders"
              desc="New delivery requests near you"
              icon={<FiList className="text-orange-500" />}
              onClick={() => navigate("/delivery/orders")}
              color="bg-orange-50"
            />
            <DashboardCard 
              title="My Deliveries"
              desc="Current tasks and delivery routes"
              icon={<FiMapPin className="text-red-500" />}
              onClick={() => navigate("/delivery/my-orders")}
              color="bg-red-50"
            />
            <DashboardCard 
              title="Live Map"
              desc="Real-time navigation and traffic"
              icon={<FiMapPin className="text-blue-500" />}
              onClick={() => navigate("/delivery/map")}
              color="bg-blue-50"
            />
            <DashboardCard 
              title="Earnings"
              desc="View your daily and weekly payouts"
              icon={<FiTrendingUp className="text-emerald-500" />}
              onClick={() => navigate("/delivery/earnings")}
              color="bg-emerald-50"
            />
          </div>
        )}

        {/* Restaurant Owner Dashboard */}
        {role === "owner" && (
          <div className="grid md:grid-cols-3 gap-8">
            <DashboardCard 
              title="Menu Management"
              desc="Update your dishes, prices, and availability"
              icon={<FiList className="text-orange-500" />}
              onClick={() => navigate("/owner/menu")}
              color="bg-orange-50"
            />
            <DashboardCard 
              title="Order Tracking"
              desc="Manage incoming orders and prep times"
              icon={<FiShoppingBag className="text-blue-500" />}
              onClick={() => navigate("/owner/orders")}
              color="bg-blue-50"
            />
            <DashboardCard 
              title="Business Analytics"
              desc="Visual insights into your sales performance"
              icon={<FiPieChart className="text-indigo-500" />}
              onClick={() => navigate("/owner/analytics")}
              color="bg-indigo-50"
            />
          </div>
        )}
      </main>
    </div>
  );
};

const DashboardCard = ({ title, desc, icon, onClick, color }) => (
  <div 
    className={`group relative overflow-hidden bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-orange-200 active:scale-[0.98]`}
    onClick={onClick}
  >
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-500 leading-relaxed">
      {desc}
    </p>
    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
        →
      </div>
    </div>
  </div>
);

export default Home;