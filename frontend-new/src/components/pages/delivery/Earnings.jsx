import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiTrendingUp, FiShoppingBag, FiDollarSign, FiAward } from "react-icons/fi";

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const fetchEarnings = async () => {
    try {
      const query = period !== "all" ? `?period=${period}` : "";
      const res = await axios.get(`${API_URL}/api/delivery/earnings${query}`, {
        withCredentials: true,
      });
      setEarnings(res.data);
    } catch (err) {
      console.log("Error fetching earnings:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Delivery partners only.");
      } else {
        setError("Failed to load earnings");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-orange-500 font-medium">Calculating profits...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Earnings Center</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-orange-50 mb-10 w-fit mx-auto sm:mx-0">
          {[
            { id: "today", label: "Today" },
            { id: "week", label: "Week" },
            { id: "month", label: "Month" },
            { id: "all", label: "Lifetime" }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
                period === p.id ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "text-gray-500 hover:text-orange-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard 
                label="Total Revenue" 
                value={`₹${earnings?.totalEarnings || 0}`} 
                icon={<FiDollarSign />}
                color="bg-emerald-50 text-emerald-600"
                desc={period === "all" ? "Total across all time" : `Earnings for this ${period}`}
              />
              <StatCard 
                label="Deliveries" 
                value={earnings?.totalDeliveries || 0} 
                icon={<FiShoppingBag />}
                color="bg-orange-50 text-orange-600"
                desc="Completed deliveries"
              />
              <StatCard 
                label="Avg. Order Value" 
                value={`₹${earnings?.totalDeliveries ? Math.round(earnings.totalEarnings / earnings.totalDeliveries) : 0}`} 
                icon={<FiTrendingUp />}
                color="bg-blue-50 text-blue-600"
                desc="Average per delivery"
              />
            </div>

            {/* Insight Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-xl">
                    <FiAward />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Performance Insights</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full shrink-0"></div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        You're currently in the <span className="font-bold text-gray-900">Top 10%</span> of earners in your area this week.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full shrink-0"></div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Peak hours (6 PM - 9 PM) are increasing your average earning by <span className="font-bold text-emerald-600">15%</span>.
                      </p>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-[2rem] p-6">
                    <h4 className="font-bold text-orange-800 text-sm mb-2">💡 Pro Tip</h4>
                    <p className="text-orange-700 text-xs leading-relaxed">
                      Accepting multiple orders from the same restaurant can double your efficiency. Keep an eye out for batched deliveries!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, desc }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-orange-200 transition-all duration-500">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
      {icon}
    </div>
    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className="text-4xl font-black text-gray-900 mb-2">{value}</div>
    <div className="text-gray-400 text-[10px] font-medium leading-tight">{desc}</div>
  </div>
);

export default Earnings;