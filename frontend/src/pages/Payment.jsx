import React, { useState, useEffect } from "react";
import { url } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMock, setIsMock] = useState(false);
  
  const primaryColor = "#ff4d2d";
  const bgcolor = "#fff9f6";

  const handlePayment = async () => {
    if (!orderId || !amount) {
      setError("Please enter order ID and amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "card") {
        // Create payment intent
        const res = await axios.post(
          `${url}/api/payment/create-intent`,
          { orderId, amount: parseFloat(amount) },
          { withCredentials: true }
        );

        if (res.data.isMock) {
          setIsMock(true);
          // In mock mode, just verify after a short delay
          setTimeout(async () => {
            await axios.post(
              `${url}/api/payment/verify`,
              { orderId },
              { withCredentials: true }
            );
            setSuccess(true);
            setLoading(false);
          }, 1500);
          return;
        }

        // Real Stripe payment would go here
        // For now, verify after "payment"
        await axios.post(
          `${url}/api/payment/verify`,
          { orderId },
          { withCredentials: true }
        );
      } else {
        // Cash on delivery
        await axios.post(
          `${url}/api/payment/cod`,
          { orderId },
          { withCredentials: true }
        );
      }

      setSuccess(true);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>Payment</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6">
        {success ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              {paymentMethod === "card" 
                ? "Your payment has been processed." 
                : "Your order has been placed with Cash on Delivery."}
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="px-6 py-3 rounded-lg text-white font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              View Orders
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-6" style={{ color: primaryColor }}>
              Complete Your Payment
            </h2>

            {/* Demo Order ID info */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Demo:</strong> Enter any order ID (or create a new one) and amount to test the payment flow.
              </p>
            </div>

            {/* Order ID */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    paymentMethod === "card" ? "text-white" : "bg-gray-100"
                  }`}
                  style={{
                    backgroundColor: paymentMethod === "card" ? primaryColor : "#f3f4f6",
                    color: paymentMethod === "card" ? "white" : "#374151",
                  }}
                >
                  💳 Card
                </button>
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    paymentMethod === "cash" ? "text-white" : "bg-gray-100"
                  }`}
                  style={{
                    backgroundColor: paymentMethod === "cash" ? primaryColor : "#f3f4f6",
                    color: paymentMethod === "cash" ? "white" : "#374151",
                  }}
                >
                  💵 Cash on Delivery
                </button>
              </div>
            </div>

            {/* Mock mode notice */}
            {isMock && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  🔧 <strong>Test Mode:</strong> Stripe is not configured. This is a simulated payment.
                  <br />
                  Add your Stripe keys to .env for real payments.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-bold"
              style={{ 
                backgroundColor: loading ? "#ccc" : primaryColor,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading 
                ? "Processing..." 
                : paymentMethod === "card" 
                  ? `Pay ₹${amount || 0}` 
                  : "Place Order (Cash on Delivery)"}
            </button>

            {/* Stripe info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              🔒 Secured by Stripe. Add STRIPE_SECRET_KEY to enable real payments.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;