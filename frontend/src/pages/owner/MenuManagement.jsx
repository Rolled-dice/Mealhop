import React, { useState, useEffect } from "react";
import { url } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MenuManagement = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "main",
    isAvailable: true,
  });
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  const categories = ["appetizer", "main", "dessert", "beverage"];

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in required fields");
      return;
    }

    setLoading(true);
    // In real app, would call API to save to restaurant's menu
    const newItem = {
      ...formData,
      price: parseFloat(formData.price),
      _id: Date.now().toString(),
    };
    
    setMenuItems([...menuItems, newItem]);
    setFormData({ name: "", description: "", price: "", category: "main", isAvailable: true });
    setShowForm(false);
    setLoading(false);
  };

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item => 
      item._id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const deleteItem = (id) => {
    if (confirm("Delete this item?")) {
      setMenuItems(menuItems.filter(item => item._id !== id));
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgcolor }}>
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-xl font-bold" style={{ color: primaryColor }}>
              ← Back
            </button>
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Menu Management</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-white font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            {showForm ? "Cancel" : "+ Add Item"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Add Item Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Add New Menu Item</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Item name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Short description"
                />
              </div>
            </div>
            
            <button
              onClick={handleAddItem}
              disabled={loading}
              className="mt-4 px-6 py-2 rounded-lg text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        )}

        {/* Menu Items */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-xl text-gray-600">No menu items yet</h2>
            <p className="text-gray-500 mt-2">Click "Add Item" to create your first menu item</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className={`bg-white p-4 rounded-lg shadow-md ${!item.isAvailable ? "opacity-60" : ""}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <span className="font-bold" style={{ color: primaryColor }}>₹{item.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-2">{item.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">{item.category}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      className={`text-sm px-2 py-1 rounded ${item.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="text-sm px-2 py-1 rounded bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
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

export default MenuManagement;