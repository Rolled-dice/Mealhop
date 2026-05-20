import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { FiArrowLeft, FiCreditCard, FiDollarSign, FiCheckCircle, FiShield, FiAlertTriangle, FiInfo } from "react-icons/fi";

const Payment = () => {
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMock, setIsMock] = useState(false);

  const handlePayment = async () => {
    if (!orderId || !amount) {
      setError("Please enter order ID and amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (paymentMethod === "card") {
        const res = await axios.post(
          `${API_URL}/api/payment/create-intent`,
          { orderId, amount: parseFloat(amount) },
          { withCredentials: true }
        );

        if (res.data.isMock) {
          setIsMock(true);
          setTimeout(async () => {
            await axios.post(
              `${API_URL}/api/payment/verify`,
              { orderId },
              { withCredentials: true }
            );
            setSuccess(true);
            setLoading(false);
          }, 1500);
          return;
        }

        await axios.post(
          `${API_URL}/api/payment/verify`,
          { orderId },
          { withCredentials: true }
        );
      } else {
        await axios.post(
          `${API_URL}/api/payment/cod`,
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
            <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-6 lg:pt-12">
        {success ? (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl shadow-emerald-100 border border-emerald-50 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-6xl text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
              {paymentMethod === "card" 
                ? "Your digital payment has been processed successfully. Your food is on its way!" 
                : "You've chosen Cash on Delivery. Please keep the exact change ready for our rider."}
            </p>
            <button
              onClick={() => window.location.href = "/orders"}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg shadow-gray-200 hover:bg-orange-500 transition-all active:scale-[0.98]"
            >
              Track My Order
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl shadow-orange-100/50 border border-orange-50/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <FiShield size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Encrypted & Secure</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                <FiInfo className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  <strong>Demo Mode:</strong> You can enter any order ID and amount to test this flow.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Reference Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. MH-9921"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Payable Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-black text-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all duration-300 ${
                      paymentMethod === "card" 
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30" 
                        : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200"
                    }`}
                  >
                    <FiCreditCard className="text-2xl" />
                    <span className="text-xs font-bold uppercase tracking-widest">Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all duration-300 ${
                      paymentMethod === "cash" 
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30" 
                        : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200"
                    }`}
                  >
                    <FiDollarSign className="text-2xl" />
                    <span className="text-xs font-bold uppercase tracking-widest">Cash</span>
                  </button>
                </div>
              </div>

              {isMock && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <FiAlertTriangle className="text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 font-medium">
                    Stripe keys not found. Running in <strong>Simulated Mode</strong>.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full group flex items-center justify-center gap-3 py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-orange-500 transition-all active:scale-[0.98] shadow-xl shadow-gray-200"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{paymentMethod === "card" ? `Pay ₹${amount || 0}` : "Confirm Order"}</span>
                    <FiCheckCircle className="text-xl" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-50">
                <img src="https://stripe.com/img/v3/home/social.png" alt="Stripe" className="h-4 opacity-30 grayscale" />
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank-level Security</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Payment;