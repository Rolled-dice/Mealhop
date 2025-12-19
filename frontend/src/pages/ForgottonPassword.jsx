import axios from "axios";
import React, { use, useState } from "react";
import { WiDirectionLeft } from "react-icons/wi";
import { useNavigate } from "react-router-dom";
import { url } from "../App";
const ForgottonPassword = () => {
  const navigate = useNavigate();
  const primaryColor = "#ff4d2d"; // Indigo-600
  const hoverColor = "#e64323"; // Indigo-700
  const bgcolor = "#fff9f6"; // Indigo-50
  const borderColor = "#ddd"; // Indigo-200
  const [state, setState] = useState(1);
  const [Email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [newpass, setNewPass] = useState("");
  const [cpass, setCPass] = useState("");
  const [passError, setPassError] = useState("");
  const otpGenerate = async () => {
    try {
      const res = await axios.post(
        `${url}/api/auth/send-otp`,
        {
          Email,
        },
        { withCredentials: true }
      );
      console.log(res.data); // ✅ ADD THIS
      if (res.data) setState(2);
    } catch (error) {
      console.log("OTP Error:", error);
    }
  };
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${url}/api/auth/verify-otp`,
        { Email, otp: otpValue },
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data) setState(3);
    } catch (error) {
      console.log("otp mismatched :", error);
    }
  };
  const resetPassword = async () => {
    try {
      if (cpass !== newpass) {
        setPassError("Passwords do not match");
        return; // ⛔ stop API call
      }
      setPassError("");
      const res = await axios.post(
        `${url}/api/auth/reset-password`,
        { Email, password: newpass },
        { withCredentials: true }
      );
      console.log(res.data);
      // if (res.data) setState(3);
      navigate("/home");
    } catch (error) {
      console.log("internal error", error);
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[#fff9f6] p-8 rounded-lg shadow-md w-full max-w-md">
          {state === 1 && (
            <div>
              <div
                className=" flex   text-xl font-semibold  mb-6 text-center"
                style={{ color: primaryColor }}
              >
                <WiDirectionLeft
                  className="cursor-pointer"
                  size={40}
                  onClick={() => {
                    navigate("/signin");
                  }}
                />
                <span className="mt-1">Forgot your password.</span>
              </div>
              <label
                className="block text-2xl mb-1 font-medium"
                style={{ color: primaryColor }}
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your Email"
                value={Email}
                className="w-full mb-2  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ border: borderColor }}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                className=" cursor-pointer w-full bg-[#ff4d2d] text-white py-2 px-4 rounded-lg hover:bg-[#e64323] transition-colors"
                onClick={otpGenerate}
              >
                Generate OTP
              </button>
            </div>
          )}
          {state === 2 && (
            <div>
              <label
                className="block text-2xl mb-1 font-medium"
                style={{ color: primaryColor }}
              >
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter your OTP"
                value={otpValue}
                className="w-full mb-2  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: borderColor }}
                onChange={(e) => {
                  setOtpValue(e.target.value);
                }}
              />
              <button
                className=" cursor-pointer w-full bg-[#ff4d2d] text-white py-2 px-4 rounded-lg hover:bg-[#e64323] transition-colors"
                onClick={verifyOtp}
              >
                Submit OTP
              </button>
            </div>
          )}
          {state === 3 && (
            <div>
              <label
                className="block text-2xl mb-1 font-medium"
                style={{ color: primaryColor }}
              >
                Enter your New Password
              </label>
              <input
                type="text"
                placeholder="Enter your New Password"
                value={newpass}
                className="w-full mb-2  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: borderColor }}
                onChange={(e) => {
                  setNewPass(e.target.value);
                }}
              />
              <label
                className="block text-2xl mb-1 font-medium"
                style={{ color: primaryColor }}
              >
                Confirm your Password
              </label>
              <input
                type="text"
                placeholder="Confirm your Password"
                value={cpass}
                className="w-full mb-2  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: borderColor }}
                onChange={(e) => {
                  setCPass(e.target.value);
                }}
              />
              {passError && (
                <p className="text-red-500 text-sm mt-1">{passError}</p>
              )}
              <button
                className="w-full bg-[#ff4d2d] text-white py-2 px-4 rounded-lg hover:bg-[#e64323] transition-colors"
                onClick={resetPassword}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgottonPassword;
