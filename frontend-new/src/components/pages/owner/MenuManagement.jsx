import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "main",
    isAvailable: true,
  });

  const categories = ["appetizer", "main", "dessert", "beverage"];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/restaurants/owner/me`, { withCredentials: true });
      setMenuItems(res.data.restaurant.menu || []);
    } catch (err) {
      console.log("Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in required fields");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/restaurants/menu`,
        { ...formData, price: parseFloat(formData.price) },
        { withCredentials: true }
      );
      setMenuItems([...menuItems, res.data.item]);
      setFormData({ name: "", description: "", price: "", category: "main", isAvailable: true });
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  const toggleAvailability = async (id) => {
    const item = menuItems.find(i => i._id === id);
    try {
      const res = await axios.put(
        `${API_URL}/api/restaurants/menu/${id}`,
        { isAvailable: !item.isAvailable },
        { withCredentials: true }
      );
      setMenuItems(menuItems.map(i => i._id === id ? res.data.item : i));
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API_URL}/api/restaurants/menu/${id}`, { withCredentials: true });
      setMenuItems(menuItems.filter(i => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = "/"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
              <FiArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 ${showForm ? 'bg-gray-100 text-gray-600' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600'}`}
          >
            {showForm ? "Cancel" : <><FiPlus /> Add Item</>}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {showForm && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/50 border border-orange-50 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">New Menu Item</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Dish Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="e.g. Spicy Pepperoni Pizza" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Price (₹) *</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                  {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Short Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="Ingredients, spice level, etc." />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={handleAddItem} className="px-10 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-[0.98]">
                Add Item to Menu
              </button>
            </div>
          </div>
        )}

        {menuItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-7xl mb-6 opacity-20">🍕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Menu is Empty</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">Add your delicious dishes to start receiving orders.</p>
            <button onClick={() => setShowForm(true)} className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-[0.98]">
              Create First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item) => (
              <div key={item._id} className={`group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 transition-all duration-500 hover:shadow-xl hover:border-orange-100 ${!item.isAvailable ? "grayscale" : ""}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full">{item.category}</span>
                  <span className="text-2xl font-black text-orange-600">₹{item.price}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2">
                  {item.description || "Freshly prepared with authentic ingredients and love."}
                </p>
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <button onClick={() => toggleAvailability(item._id)} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${item.isAvailable ? "text-emerald-500 hover:text-emerald-600" : "text-gray-400 hover:text-orange-500"}`}>
                    {item.isAvailable ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                    {item.isAvailable ? "Available" : "Sold Out"}
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Item">
                    <FiTrash2 size={18} />
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

export default MenuManagement;
