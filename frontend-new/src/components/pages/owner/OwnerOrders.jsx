import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiClock, FiCheckCircle, FiCoffee, FiTruck, FiAlertCircle } from "react-icons/fi";

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders/owner/all`, { withCredentials: true });
      setOrders(res.data.orders);
    } catch (err) {
      console.log("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders(orders.map(o => o._id === orderId ? res.data.order : o));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { color: "bg-amber-50 text-amber-600 border-amber-100", icon: <FiClock /> };
      case "preparing": return { color: "bg-orange-50 text-orange-600 border-orange-100", icon: <FiCoffee /> };
      case "ready": return { color: "bg-purple-50 text-purple-600 border-purple-100", icon: <FiTruck /> };
      default: return { color: "bg-gray-50 text-gray-600 border-gray-100", icon: <FiAlertCircle /> };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-[#fff9f6] pb-12">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = "/"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Live Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-orange-50 mb-8 w-fit">
          {["all", "pending", "preparing", "ready"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${filter === f ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "text-gray-500 hover:text-orange-600"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-6xl mb-6">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders</h2>
            <p className="text-gray-500">Orders will appear here in real-time.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filtered.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${statusInfo.color.split(' ')[0]} rounded-2xl flex items-center justify-center text-2xl`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900">Order #{order._id.slice(-6)}</h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusInfo.color}`}>{order.status}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 font-medium">
                            {new Date(order.createdAt || order.placedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-3xl font-black text-orange-600">₹{order.totalAmount}</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100/50">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items</h4>
                        <ul className="space-y-3">
                          {order.items?.map((item, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm font-medium">
                              <span className="text-gray-700"><span className="text-orange-500 font-black mr-2">{item.quantity}x</span>{item.name}</span>
                              <span className="text-gray-900">₹{item.price * item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100/50">
                        <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-4">Customer</h4>
                        <p className="text-lg font-bold text-gray-900 mb-1">{order.userId?.Fullname || "Customer"}</p>
                        <p className="text-sm text-orange-600 font-bold">{order.userId?.PhoneNumber || ""}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {order.status === "pending" && (
                        <button onClick={() => updateStatus(order._id, "preparing")} className="flex-1 group flex items-center justify-center gap-3 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all active:scale-[0.98] shadow-lg shadow-gray-200">
                          <span>Accept & Start Preparing</span>
                          <FiCheckCircle className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                      {order.status === "preparing" && (
                        <button onClick={() => updateStatus(order._id, "ready")} className="flex-1 group flex items-center justify-center gap-3 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all active:scale-[0.98] shadow-lg shadow-orange-100">
                          <span>Mark Ready for Pickup</span>
                          <FiTruck className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                      {order.status === "ready" && (
                        <div className="flex-1 py-4 bg-emerald-50 text-emerald-600 text-center font-bold rounded-2xl border border-emerald-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                          <FiCheckCircle /> Awaiting Delivery Partner
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

export default OwnerOrders;
