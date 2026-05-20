import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiStar, FiClock, FiShoppingBag, FiPlus, FiMinus } from "react-icons/fi";

const RestaurantDetail = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const id = typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "";

  useEffect(() => {
    if (id) fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/restaurants/${id}`);
      setRestaurant(res.data.restaurant);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(c => c._id === item._id);
    if (existing) {
      setCart(cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find(c => c._id === itemId);
    if (existing.quantity === 1) {
      setCart(cart.filter(c => c._id !== itemId));
    } else {
      setCart(cart.map(c => c._id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    }
  };

  const getCartTotal = () => cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Add items to cart first");
    try {
      const res = await axios.post(`${API_URL}/api/orders`, {
        restaurantId: id,
        items: cart.map(c => ({ name: c.name, price: c.price, quantity: c.quantity })),
        deliveryAddress: { city: "Delhi" },
        paymentMethod: "cash",
      }, { withCredentials: true });
      alert("Order placed successfully!");
      window.location.href = "/orders";
    } catch (err) {
      if (err.response?.status === 401) window.location.href = "/signin";
      else alert(err.response?.data?.message || "Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-500">Restaurant not found</p>
          <a href="/restaurants" className="inline-block mt-4 px-6 py-3 bg-orange-500 text-white font-bold rounded-2xl">← Back</a>
        </div>
      </div>
    );
  }

  const categories = [...new Set(restaurant.menu?.map(i => i.category))];

  return (
    <div className="min-h-screen bg-[#fff9f6] pb-32">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <button onClick={() => window.location.href = "/restaurants"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-xs text-gray-500">{restaurant.cuisine?.join(", ")}</p>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
            {restaurant.rating > 0 && <span className="flex items-center gap-1 text-emerald-600 font-bold"><FiStar size={14} /> {restaurant.rating}</span>}
            <span className="flex items-center gap-1"><FiClock size={14} /> {restaurant.deliveryTime}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {categories.map(cat => (
          <div key={cat} className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4">{cat}</h2>
            <div className="grid gap-4">
              {restaurant.menu.filter(i => i.category === cat && i.isAvailable).map(item => {
                const inCart = cart.find(c => c._id === item._id);
                return (
                  <div key={item._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      <p className="text-orange-600 font-bold mt-2">₹{item.price}</p>
                    </div>
                    <div>
                      {inCart ? (
                        <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-3 py-1">
                          <button onClick={() => removeFromCart(item._id)} className="text-orange-600"><FiMinus /></button>
                          <span className="font-bold text-gray-900">{inCart.quantity}</span>
                          <button onClick={() => addToCart(item)} className="text-orange-600"><FiPlus /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item)} className="px-4 py-2 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-all">
                          ADD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-2xl p-4 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{cart.reduce((s, c) => s + c.quantity, 0)} items</p>
              <p className="text-xl font-black text-gray-900">₹{getCartTotal() + (restaurant.deliveryFee || 30)}<span className="text-xs text-gray-400 font-normal ml-1">(incl. ₹{restaurant.deliveryFee || 30} delivery)</span></p>
            </div>
            <button onClick={placeOrder} className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-[0.98]">
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
