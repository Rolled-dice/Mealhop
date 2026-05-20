import axios from "axios";
import React, { useState } from "react";
import { API_URL } from "@/lib/constants";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

const SignIn = () => {
  const [Email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignin = async () => {
    if (!Email || !passwordInput) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signin`,
        {
          Email,
          password: passwordInput,
        },
        { withCredentials: true }
      );
      console.log("Signin Success:", res.data);
      window.location.href = "/";
    } catch (error) {
      console.log("Signin Error:", error);
      setError(error.response?.data?.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff9f6] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-sm border border-orange-100 mb-4">
            <span className="text-4xl">🍔</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to continue enjoying delicious meals</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50/50">
          <div className="space-y-6">
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

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <button 
                  onClick={() => window.location.href = "/forgotpassword"}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  onChange={(e) => setPasswordInput(e.target.value)}
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
              className={`w-full group flex items-center justify-center gap-2 px-4 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed`}
              onClick={handleSignin}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <button 
            onClick={() => window.location.href = "/signup"}
            className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
