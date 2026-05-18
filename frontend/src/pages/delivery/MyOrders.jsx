import React, { useState, useEffect } from "react";
import { url } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  useEffect(() => {
    fetchMyOrders();
  }, [filter]);

  const fetchMyOrders = async () => {
    try {
      const query = filter !== "all" ? `?status=${filter}` : "";
      const res = await axios.get(`${url}/api/delivery/orders/my${query}`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.log("Error fetching orders:", err);
      if (err.response?.status === 403) {
        setError("Access denied. This page is for delivery partners only.");
      } else {
        setError("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${url}/api/delivery/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchMyOrders(); // Refresh list
      alert(`Order marked as ${newStatus.replace("_", " ")}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-yellow-100 text-yellow-800";
      case "ready": return "bg-orange-100 text-orange-800";
      case "picked_up": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgcolor }}>
        <div className="text-2xl" style={{ color: primaryColor }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgcolor }}>
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgcolor }}>
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-xl font-bold" style={{ color: primaryColor }}>
              ← Back
            </button>
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>My Deliveries</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "picked_up", "delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === f ? "text-white" : "bg-white"
              }`}
              style={{ 
                backgroundColor: filter === f ? primaryColor : "white",
                color: filter === f ? "white" : primaryColor,
                border: `1px solid ${primaryColor}`
              }}
            >
              {f === "all" ? "All" : f.replace("_", " ").charAt(0).toUpperCase() + f.slice(2)}
            </button>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚴</div>
            <h2 className="text-xl text-gray-600">No deliveries yet</h2>
            <p className="text-gray-500 mt-2">Accept orders from the available orders page</p>
            <button
              onClick={() => navigate("/delivery/orders")}
              className="mt-4 px-6 py-2 rounded-lg text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              View Available Orders
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{order.restaurantId?.name || "Restaurant"}</h3>
                    <p className="text-gray-600">
                      {order.restaurantId?.address?.street}, {order.restaurantId?.address?.city}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(order.status)}`}>
                      {order.status?.replace("_", " ")}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: primaryColor }}>₹{order.totalAmount}</div>
                    <div className="text-sm text-gray-500">Earning: ₹{order.deliveryFee || 30}</div>
                    {order.deliveryOtp && (
                      <div className="text-sm font-mono mt-1">OTP: {order.deliveryOtp}</div>
                    )}
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-1">Delivery Address:</h4>
                  <p className="text-gray-600">
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                  <p className="text-sm text-gray-500">Customer: {order.userId?.Fullname} | {order.userId?.PhoneNumber}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === "accepted" && (
                    <button
                      onClick={() => updateStatus(order._id, "picked_up")}
                      className="flex-1 py-3 rounded-lg text-white font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Picked Up
                    </button>
                  )}
                  {order.status !== "delivered" && (
                    <button
                      onClick={() => navigate(`/delivery/map?order=${order._id}`)}
                      className="flex-1 py-3 rounded-lg font-bold border"
                      style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                      📍 Track
                    </button>
                  )}
                  {order.status === "picked_up" && (
                    <button
                      onClick={() => updateStatus(order._id, "delivered")}
                      className="flex-1 py-3 rounded-lg text-white font-bold bg-green-600 hover:bg-green-700"
                    >
                      Delivered
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <div className="flex-1 py-3 rounded-lg text-center bg-green-100 text-green-800 font-bold">
                      Completed ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;