import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DeliveryMap = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  // Demo coordinates (would come from order in real app)
  const restaurantCoords = "12.9716,77.5946"; // Bangalore
  const customerCoords = "12.9352,77.6245"; // Near Bangalore
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  const handleShowMap = () => {
    if (orderId) {
      setShowMap(true);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgcolor }}>
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/delivery/my-orders")} className="text-xl font-bold" style={{ color: primaryColor }}>
              ← Back
            </button>
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Live Tracking</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Order Input */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Track Your Delivery</h2>
          
          <div className="flex gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Order ID"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            />
            <button
              onClick={handleShowMap}
              className="px-6 py-2 rounded-lg text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              Track
            </button>
          </div>
        </div>

        {/* Map Display */}
        {showMap && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Delivery Route</h3>
            
            {/* OpenStreetMap Embed - Free, no API key needed */}
            <div className="relative h-96 rounded-lg overflow-hidden">
              <iframe
                title="Delivery Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=77.55%2C12.90%2C77.70%2C13.00&layer=mapnik&marker=${restaurantCoords}&marker=${customerCoords}`}
                style={{ border: "1px solid #ddd", borderRadius: "8px" }}
              />
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Restaurant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Customer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Delivery Partner</span>
              </div>
            </div>

            {/* Route Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-medium">Restaurant</div>
                  <div className="text-sm text-gray-600">123 Food Street, Bangalore</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-medium">Customer</div>
                  <div className="text-sm text-gray-600">456 Customer Ave, Bangalore</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated arrival</span>
                  <span className="font-bold" style={{ color: primaryColor }}>~15 min</span>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Note:</strong> This is a demo map using OpenStreetMap (free). 
                For real-time tracking with live delivery partner location, add Google Maps API key to .env.
              </p>
            </div>
          </div>
        )}

        {!showMap && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-xl text-gray-600">Enter an order ID to track</h2>
            <p className="text-gray-500 mt-2">Real-time map showing restaurant and delivery location</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryMap;