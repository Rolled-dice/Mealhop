import React, { useState, useEffect } from "react";
import { url } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AvailableOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/delivery/orders/available`, {
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

  const acceptOrder = async (orderId) => {
    try {
      await axios.post(
        `${url}/api/delivery/orders/${orderId}/accept`,
        {},
        { withCredentials: true }
      );
      // Remove from list and show success
      setOrders(orders.filter((o) => o._id !== orderId));
      alert("Order accepted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept order");
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
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Available Orders</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl text-gray-600">No orders available right now</h2>
            <p className="text-gray-500 mt-2">Check back soon for new delivery requests</p>
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
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: primaryColor }}>₹{order.totalAmount}</div>
                    <div className="text-sm text-gray-500">Delivery: ₹{order.deliveryFee || 30}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <ul className="text-gray-600">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-1">Delivery Address:</h4>
                  <p className="text-gray-600">
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                  <p className="text-sm text-gray-500">Customer: {order.userId?.Fullname} | {order.userId?.PhoneNumber}</p>
                </div>

                <button
                  onClick={() => acceptOrder(order._id)}
                  className="w-full py-3 rounded-lg text-white font-bold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Accept Order
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AvailableOrders;