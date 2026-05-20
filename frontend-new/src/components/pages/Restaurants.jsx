import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiSearch, FiStar, FiClock, FiShoppingBag } from "react-icons/fi";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/restaurants`, { withCredentials: true });
      setRestaurants(res.data.restaurants);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cuisine?.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <button onClick={() => window.location.href = "/"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <div className="flex-1 max-w-md ml-auto relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisine..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-7xl mb-6">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {restaurants.length === 0 ? "No Restaurants Yet" : "No Results"}
            </h2>
            <p className="text-gray-500">
              {restaurants.length === 0 ? "Restaurants will appear here once they're onboarded." : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((r) => (
              <a key={r._id} href={`/restaurants/${r._id}`} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all duration-500">
                <div className="h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-6xl">
                  🍽️
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{r.name}</h3>
                    {r.rating > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
                        <FiStar size={12} /> {r.rating}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{r.cuisine?.join(", ") || "Multi-cuisine"}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1"><FiClock size={12} /> {r.deliveryTime || "30-45 min"}</span>
                    <span className="flex items-center gap-1"><FiShoppingBag size={12} /> Min ₹{r.minimumOrder || 100}</span>
                  </div>
                  <div className={`mt-4 inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${r.isOpen ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {r.isOpen ? "Open" : "Closed"}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Restaurants;
