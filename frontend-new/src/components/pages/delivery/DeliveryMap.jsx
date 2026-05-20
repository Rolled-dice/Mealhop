import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiMapPin, FiNavigation, FiClock, FiPackage } from "react-icons/fi";

const DeliveryMap = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/delivery/orders/my`, { withCredentials: true });
      const active = res.data.orders.filter(o => o.status === "picked_up");
      setOrders(active);
      if (active.length > 0) setSelectedOrder(active[0]);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMapUrl = (order) => {
    const restLat = order.restaurantAddress?.coordinates?.lat || 28.6139;
    const restLng = order.restaurantAddress?.coordinates?.lng || 77.2090;
    const custLat = order.deliveryAddress?.coordinates?.lat || restLat + 0.02;
    const custLng = order.deliveryAddress?.coordinates?.lng || restLng + 0.02;

    const minLat = Math.min(restLat, custLat) - 0.01;
    const maxLat = Math.max(restLat, custLat) + 0.01;
    const minLng = Math.min(restLng, custLng) - 0.01;
    const maxLng = Math.max(restLng, custLng) + 0.01;

    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${restLat}%2C${restLng}`;
  };

  const markDelivered = async (orderId) => {
    try {
      await axios.patch(`${API_URL}/api/delivery/orders/${orderId}/status`, { status: "delivered" }, { withCredentials: true });
      setOrders(orders.filter(o => o._id !== orderId));
      setSelectedOrder(null);
      alert("Order marked as delivered!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
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
    <div className="min-h-screen bg-[#fff9f6]">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <button onClick={() => window.location.href = "/"} className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-orange-600">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Live Delivery Map</h1>
          {orders.length > 0 && (
            <span className="ml-auto px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
              {orders.length} active
            </span>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-orange-50">
            <div className="text-7xl mb-6">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Deliveries</h2>
            <p className="text-gray-500 mb-6">Accept an order to see the delivery route here.</p>
            <a href="/delivery/orders" className="inline-flex px-8 py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all">
              View Available Orders
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order List */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Active Deliveries</h3>
              {orders.map(order => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedOrder?._id === order._id ? "bg-orange-50 border-orange-200 shadow-md" : "bg-white border-gray-100 hover:border-orange-100"}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FiPackage className="text-orange-500" />
                    <span className="font-bold text-gray-900 text-sm">#{order._id.slice(-6)}</span>
                  </div>
                  <p className="text-xs text-gray-500">{order.userId?.Fullname || "Customer"}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.deliveryAddress?.street || order.deliveryAddress?.city || "Address on map"}
                  </p>
                </div>
              ))}
            </div>

            {/* Map + Details */}
            {selectedOrder && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-[400px] rounded-2xl overflow-hidden">
                    <iframe
                      title="Delivery Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      src={getMapUrl(selectedOrder)}
                    />
                  </div>
                  <div className="mt-4 flex justify-center gap-6 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-bold text-gray-500">Restaurant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs font-bold text-gray-500">Customer</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <FiNavigation className="text-orange-500" />
                      <h4 className="font-bold text-gray-900">Route</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full border-2 border-blue-500 flex items-center justify-center text-[10px] font-bold text-blue-600">A</div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.restaurantId?.name || "Restaurant"}</p>
                          <p className="text-xs text-gray-500">{selectedOrder.restaurantAddress?.street || selectedOrder.restaurantAddress?.city || ""}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-red-50 rounded-full border-2 border-red-500 flex items-center justify-center text-[10px] font-bold text-red-600">B</div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Drop</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.userId?.Fullname || "Customer"}</p>
                          <p className="text-xs text-gray-500">{selectedOrder.deliveryAddress?.street || selectedOrder.deliveryAddress?.city || ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FiClock className="text-orange-500" />
                        <h4 className="font-bold text-gray-900">Order Details</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{selectedOrder.items?.length} items • ₹{selectedOrder.totalAmount}</p>
                      <p className="text-xs text-gray-400">OTP: <span className="font-bold text-gray-700">{selectedOrder.deliveryOtp || "N/A"}</span></p>
                    </div>
                    <button
                      onClick={() => markDelivered(selectedOrder._id)}
                      className="mt-4 w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all active:scale-[0.98] shadow-lg shadow-emerald-200"
                    >
                      ✓ Mark Delivered
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryMap;
