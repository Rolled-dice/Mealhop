import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OwnerOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  // Demo orders - in real app would fetch from API
  const demoOrders = [
    {
      _id: "1",
      items: [{ name: "Burger", quantity: 2, price: 150 }, { name: "Fries", quantity: 1, price: 80 }],
      totalAmount: 380,
      status: "pending",
      userId: { Fullname: "John Doe", PhoneNumber: "9876543210" },
      placedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      items: [{ name: "Pizza", quantity: 1, price: 350 }],
      totalAmount: 350,
      status: "preparing",
      userId: { Fullname: "Jane Smith", PhoneNumber: "9876543211" },
      placedAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  const updateStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-orange-100 text-orange-800";
      case "ready": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
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
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Orders</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "preparing", "ready"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg font-medium"
              style={{ 
                backgroundColor: filter === f ? primaryColor : "white",
                color: filter === f ? "white" : primaryColor,
                border: `1px solid ${primaryColor}`
              }}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {orders.length === 0 && demoOrders.length > 0 && setOrders(demoOrders)}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl text-gray-600">No orders yet</h2>
            <p className="text-gray-500 mt-2">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders
              .filter(o => filter === "all" || o.status === filter)
              .map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.placedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: primaryColor }}>₹{order.totalAmount}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <ul className="text-gray-600">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Customer: {order.userId?.Fullname} | {order.userId?.PhoneNumber}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order._id, "preparing")}
                      className="flex-1 py-2 rounded-lg text-white font-bold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Accept & Prepare
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateStatus(order._id, "ready")}
                      className="flex-1 py-2 rounded-lg text-white font-bold bg-purple-600"
                    >
                      Mark Ready for Pickup
                    </button>
                  )}
                  {order.status === "ready" && (
                    <div className="flex-1 py-2 rounded-lg text-center bg-green-100 text-green-800 font-bold">
                      Awaiting Pickup ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OwnerOrders;