import React, { useState } from "react";
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { API_URL } from "@/lib/constants";
import axios from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [Fullname, setFullName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!Fullname || !Email || !passwordInput || !PhoneNumber) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          Fullname,
          Email,
          password: passwordInput,
          PhoneNumber,
          role,
        },
        { withCredentials: true }
      );
      console.log("Signup Success:", res.data);
      window.location.href = "/signin";
    } catch (error) {
      console.log("Signup Error:", error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff9f6] py-12 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-orange-100 mb-4">
            <span className="text-3xl">🍔</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join MealHop and start enjoying delicious food</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-orange-100/50 border border-orange-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={Fullname}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
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
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="+1 234 567 890"
                  value={PhoneNumber}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={passwordInput}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "user", label: "Customer", icon: "🍕" },
                  { id: "owner", label: "Restaurant", icon: "🏪" },
                  { id: "deliveryBoy", label: "Delivery", icon: "🚴" }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                      role === r.id
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200"
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full mt-8 group flex items-center justify-center gap-2 px-4 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-[0.98] disabled:opacity-70"
            onClick={handleSignup}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create Account</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">Or sign up with</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]">
            <FcGoogle className="text-xl" />
            <span>Google</span>
          </button>
        </div>

        <p className="text-center mt-8 text-gray-600">
          Already have an account?{" "}
          <button 
            onClick={() => window.location.href = "/signin"}
            className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
