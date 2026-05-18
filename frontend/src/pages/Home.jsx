import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../App";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgcolor = "#fff9f6";
  const borderColor = "#ddd";

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${url}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.log("Not authenticated:", error);
      // Redirect to signin if not authenticated
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${url}/api/auth/logout`, {}, { withCredentials: true });
      navigate("/signin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgcolor }}>
        <div className="text-2xl" style={{ color: primaryColor }}>Loading...</div>
      </div>
    );
  }

  const role = user?.role;

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgcolor }}>
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>MealHop</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.Fullname || user?.email}</span>
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize">{role}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: primaryColor }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* User Dashboard */}
        {role === "user" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>Food Delivery</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Browse Restaurants */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/restaurants")}
              >
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold mb-2">Browse Restaurants</h3>
                <p className="text-gray-600">Find your favorite food from local restaurants</p>
              </div>
              
              {/* My Orders */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/orders")}
              >
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">My Orders</h3>
                <p className="text-gray-600">Track and manage your orders</p>
              </div>

              {/* Payment Methods */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/payment")}
              >
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-2">Payment</h3>
                <p className="text-gray-600">Manage payment methods</p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Agent Dashboard */}
        {role === "deliveryBoy" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>Delivery Partner</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Available Orders */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/delivery/orders")}
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">Available Orders</h3>
                <p className="text-gray-600">View and accept new delivery requests</p>
              </div>

              {/* My Deliveries */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/delivery/my-orders")}
              >
                <div className="text-4xl mb-4">🚴</div>
                <h3 className="text-xl font-semibold mb-2">My Deliveries</h3>
                <p className="text-gray-600">View your assigned deliveries</p>
              </div>

              {/* Earnings */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/delivery/earnings")}
              >
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Earnings</h3>
                <p className="text-gray-600">Track your earnings and ratings</p>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Owner Dashboard */}
        {role === "owner" && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold" style={{ color: primaryColor }}>Restaurant Owner</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Menu Management */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/owner/menu")}
              >
                <div className="text-4xl mb-4">🍕</div>
                <h3 className="text-xl font-semibold mb-2">Menu Management</h3>
                <p className="text-gray-600">Add, edit, or remove menu items</p>
              </div>

              {/* Orders */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/owner/orders")}
              >
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">Orders</h3>
                <p className="text-gray-600">View and manage incoming orders</p>
              </div>

              {/* Analytics */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate("/owner/analytics")}
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600">View sales and performance metrics</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;