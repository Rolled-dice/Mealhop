import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiShoppingBag, FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";

const AvailableOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/delivery/orders/available`, {
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
        `${API_URL}/api/delivery/orders/${orderId}/accept`,
        {},
        { withCredentials: true }
      );
      setOrders(orders.filter((o) => o._id !== orderId));
      alert("Order accepted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-500 font-medium animate-pulse">Scanning for orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f6] pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = "/"}
              className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
          </div>
          <div className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-bold animate-pulse">
            {orders.length} ACTIVE REQUESTS
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-6xl mb-6">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Resting Time!</h2>
            <p className="text-gray-500 max-w-sm mx-auto">Check back soon, new orders pop up every minute.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.map((order) => (
              <div key={order._id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-orange-200/50 border border-gray-100 hover:border-orange-200 transition-all duration-500 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full mb-2 inline-block">
                        Restaurant
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">
                        {order.restaurantId?.name || "Premium Eatery"}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 mt-1">
                        <FiMapPin className="text-orange-400" />
                        <span className="text-sm truncate max-w-[200px]">
                          {order.restaurantId?.address?.street}, {order.restaurantId?.address?.city}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black text-orange-600">₹{order.totalAmount}</div>
                      <div className="text-xs font-bold text-gray-400">EST. EARNING</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold text-sm">
                        <FiShoppingBag className="text-orange-500" />
                        Order Items
                      </div>
                      <ul className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex justify-between">
                            <span>{item.quantity}x {item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50">
                      <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-sm">
                        <FiMapPin />
                        Drop Location
                      </div>
                      <p className="text-sm text-orange-800 font-medium">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => acceptOrder(order._id)}
                    className="w-full group flex items-center justify-center gap-3 py-4 bg-gray-900 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-gray-200 active:scale-[0.98]"
                  >
                    <span>Accept Delivery</span>
                    <FiCheckCircle className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AvailableOrders;