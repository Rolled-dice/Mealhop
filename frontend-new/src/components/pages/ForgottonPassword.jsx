import axios from "axios";
import React, { useState } from "react";
import { FiArrowLeft, FiMail, FiShield, FiLock, FiCheckCircle } from "react-icons/fi";
import { API_URL } from "@/lib/constants";

const ForgottonPassword = () => {
  const [state, setState] = useState(1);
  const [Email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [newpass, setNewPass] = useState("");
  const [cpass, setCPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const otpGenerate = async () => {
    if (!Email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/send-otp`,
        { Email },
        { withCredentials: true }
      );
      if (res.data) setState(2);
    } catch (error) {
      console.log("OTP Error:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpValue) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { Email, otp: otpValue },
        { withCredentials: true }
      );
      if (res.data) setState(3);
    } catch (error) {
      console.log("OTP mismatched:", error);
      setError("Invalid OTP. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newpass || !cpass) {
      setError("Please fill in all fields");
      return;
    }
    if (cpass !== newpass) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        { Email, password: newpass },
        { withCredentials: true }
      );
      window.location.href = "/signin";
    } catch (error) {
      console.log("Reset error:", error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff9f6] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50/50 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(state / 3) * 100}%` }}
            ></div>
          </div>

          <button 
            onClick={() => state === 1 ? window.location.href = "/signin" : setState(state - 1)}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8 mt-2 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold uppercase tracking-wider">Back</span>
          </button>

          {state === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiMail className="text-3xl text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                <p className="text-gray-500 mt-2">Enter your email to receive a password reset OTP</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={Email}
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                disabled={loading}
                onClick={otpGenerate}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {state === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiShield className="text-3xl text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-gray-500 mt-2">We've sent a 6-digit code to <span className="text-gray-900 font-medium">{Email}</span></p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1 text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otpValue}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  maxLength={6}
                  onChange={(e) => setOtpValue(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                disabled={loading}
                onClick={verifyOtp}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button onClick={otpGenerate} className="text-orange-600 font-bold hover:underline">Resend</button>
              </p>
            </div>
          )}

          {state === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FiLock className="text-3xl text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">New Password</h2>
                <p className="text-gray-500 mt-2">Secure your account with a new password</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newpass}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={cpass}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    onChange={(e) => setCPass(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                disabled={loading}
                onClick={resetPassword}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgottonPassword;
