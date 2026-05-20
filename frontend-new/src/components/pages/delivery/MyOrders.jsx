import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiMapPin, FiTruck, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMyOrders();
  }, [filter]);

  const fetchMyOrders = async () => {
    try {
      const query = filter !== "all" ? `?status=${filter}` : "";
      const res = await axios.get(`${API_URL}/api/delivery/orders/my${query}`, {
        withCredentials: true,
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.log("Error fetching orders:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Delivery partners only.");
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
        `${API_URL}/api/delivery/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchMyOrders();
      alert(`Order marked as ${newStatus.replace("_", " ")}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "accepted": return { color: "bg-blue-50 text-blue-600 border-blue-100", icon: <FiClock /> };
      case "picked_up": return { color: "bg-purple-50 text-purple-600 border-purple-100", icon: <FiTruck /> };
      case "delivered": return { color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <FiCheckCircle /> };
      default: return { color: "bg-gray-50 text-gray-600 border-gray-100", icon: <FiAlertCircle /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-500 font-medium">Fetching your deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f6] pb-12">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = "/"}
              className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600"
            >
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-orange-50 mb-8 w-fit mx-auto sm:mx-0">
          {[
            { id: "all", label: "All" },
            { id: "picked_up", label: "Active" },
            { id: "delivered", label: "Completed" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                filter === f.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "text-gray-500 hover:text-orange-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-6xl mb-6">🚴</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Deliveries Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">Start earning by accepting orders from the available pool.</p>
            <button
              onClick={() => window.location.href = "/delivery/orders"}
              className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-[0.98]"
            >
              Find Orders
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color} mb-3 uppercase tracking-wider`}>
                          {statusInfo.icon}
                          <span>{order.status?.replace("_", " ")}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                          {order.restaurantId?.name || "Restaurant"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <FiMapPin className="text-orange-400" />
                          {order.restaurantId?.address?.city}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-600">₹{order.totalAmount}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Earning</div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                        <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold text-xs uppercase tracking-widest">
                          Customer
                        </div>
                        <p className="text-sm font-bold text-gray-800">{order.userId?.Fullname}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.deliveryAddress?.street}</p>
                      </div>

                      {order.deliveryOtp && order.status !== "delivered" && (
                        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 border-dashed">
                          <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Security OTP</div>
                          <div className="text-2xl font-black tracking-widest text-orange-700">{order.deliveryOtp}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {order.status === "accepted" && (
                        <button
                          onClick={() => updateStatus(order._id, "picked_up")}
                          className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all active:scale-[0.98] shadow-lg shadow-gray-200"
                        >
                          Mark Picked Up
                        </button>
                      )}
                      {order.status === "picked_up" && (
                        <button
                          onClick={() => updateStatus(order._id, "delivered")}
                          className="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-100"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status !== "delivered" && (
                        <button
                          onClick={() => window.location.href = `/delivery/map?order=${order._id}`}
                          className="p-4 bg-white border border-gray-100 text-gray-700 font-bold rounded-2xl hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm"
                          title="View on Map"
                        >
                          <FiMapPin size={20} />
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <div className="flex-1 py-4 bg-emerald-50 text-emerald-600 text-center font-bold rounded-2xl border border-emerald-100">
                          COMPLETED ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;