import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiClock, FiCheckCircle, FiPackage, FiTruck } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/my`, { withCredentials: true });
      setOrders(res.data.orders);
    } catch (err) {
      console.log("Error:", err);
      if (err.response?.status === 401) window.location.href = "/signin";
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <FiCheckCircle className="text-emerald-500" />;
      case "picked_up": return <FiTruck className="text-blue-500" />;
      case "preparing": case "ready": return <FiPackage className="text-orange-500" />;
      default: return <FiClock className="text-amber-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f6] pb-12">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <button onClick={() => window.location.href = "/"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-7xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-8">Start ordering from your favorite restaurants!</p>
            <a href="/restaurants" className="inline-flex px-8 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
              Explore Restaurants
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.restaurantId?.name || "Restaurant"}</h3>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{order.status.replace("_", " ")}</span>
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-4">
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.quantity}x {item.name}</span>
                        <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-xl font-black text-orange-600">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
