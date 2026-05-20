import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiTrendingUp, FiShoppingBag, FiDollarSign, FiStar } from "react-icons/fi";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/owner/analytics`, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      console.log("Error:", err);
      if (err.response?.status === 401) window.location.href = "/signin";
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">Unable to load analytics. Make sure you have a restaurant set up.</p>
          <a href="/" className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl">← Back</a>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `₹${data.totalRevenue}`, icon: <FiDollarSign />, color: "bg-emerald-50 text-emerald-600" },
    { label: "Today's Revenue", value: `₹${data.todayRevenue}`, icon: <FiTrendingUp />, color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: data.totalOrders, icon: <FiShoppingBag />, color: "bg-orange-50 text-orange-600" },
    { label: "Avg Order Value", value: `₹${data.averageOrderValue}`, icon: <FiDollarSign />, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-[#fff9f6] pb-12">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <button onClick={() => window.location.href = "/"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-xl mb-4`}>
                {s.icon}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Order Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Delivered</span>
                <span className="font-bold text-emerald-600">{data.deliveredOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-bold text-amber-600">{data.pendingOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="font-bold text-red-500">{data.cancelledOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week Revenue</span>
                <span className="font-bold text-blue-600">₹{data.weekRevenue}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Items</h3>
            {data.topItems?.length > 0 ? (
              <div className="space-y-4">
                {data.topItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mr-2">#{i + 1}</span>{item.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{item.count} sold</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No sales data yet.</p>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rating</h3>
            <div className="flex items-center gap-3">
              <FiStar className="text-amber-400" size={28} />
              <span className="text-3xl font-black text-gray-900">{data.rating || "N/A"}</span>
              <span className="text-sm text-gray-400">({data.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
