import React, { useState, useEffect } from "react";
import { url } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Earnings = () => {
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("all");
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const fetchEarnings = async () => {
    try {
      const query = period !== "all" ? `?period=${period}` : "";
      const res = await axios.get(`${url}/api/delivery/earnings${query}`, {
        withCredentials: true,
      });
      setEarnings(res.data);
    } catch (err) {
      console.log("Error fetching earnings:", err);
      if (err.response?.status === 403) {
        setError("Access denied. This page is for delivery partners only.");
      } else {
        setError("Failed to load earnings");
      }
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>My Earnings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Period Filter */}
        <div className="flex gap-2 mb-6">
          {["today", "week", "month", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium`}
              style={{ 
                backgroundColor: period === p ? primaryColor : "white",
                color: period === p ? "white" : primaryColor,
                border: `1px solid ${primaryColor}`
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Earnings</div>
            <div className="text-4xl font-bold" style={{ color: primaryColor }}>
              ₹{earnings?.totalEarnings || 0}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              {period === "today" ? "Today" : 
               period === "week" ? "This Week" : 
               period === "month" ? "This Month" : "All Time"}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Deliveries</div>
            <div className="text-4xl font-bold" style={{ color: primaryColor }}>
              {earnings?.totalDeliveries || 0}
            </div>
            <div className="text-gray-500 text-sm mt-2">Orders completed</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Avg. per Delivery</div>
            <div className="text-4xl font-bold" style={{ color: primaryColor }}>
              ₹{earnings?.totalDeliveries ? Math.round(earnings.totalEarnings / earnings.totalDeliveries) : 0}
            </div>
            <div className="text-gray-500 text-sm mt-2">Per order average</div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 How earnings work</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You earn ₹30 per delivery (delivery fee)</li>
            <li>• Earnings are credited when order is marked as delivered</li>
            <li>• Cash payments are also included in your earnings</li>
            <li>• Payouts are processed weekly</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Earnings;