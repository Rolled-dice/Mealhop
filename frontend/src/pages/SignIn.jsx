import axios from "axios";
import React, { useState } from "react";
import { url } from "../App";

const SignIn = () => {
  const primaryColor = "#ff4d2d"; // Indigo-600
  const hoverColor = "#e64323"; // Indigo-700
  const bgcolor = "#fff9f6"; // Indigo-50
  const borderColor = "#ddd"; // Indigo-200
  const [Email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const handleSignin = async () => {
    try {
      const res = await axios.post(
        `${url}/api/auth/signin`,
        {
          Email,
          password: passwordInput,
        },
        { withCredentials: true }
      );
      console.log("Signin Success:", res.data); // ✅ ADD THIS
    } catch (error) {
      console.log("Signin Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h2
          className="text-2xl font-bold mb-3 text-center"
          style={{ color: primaryColor }}
        >
          MealHop
        </h2>
        <h3
          className="text-xl font-semibold  mb-6 text-center"
          //   style={{ color: primaryColor }}
        >
          Sign in to your account to continue enjoying delicious meals
        </h3>
        {/* <form className="space-y-4"> */}
        <div>
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
            style={{ borderColor: borderColor }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label
            className="block text-2xl mb-1 font-medium"
            style={{ color: primaryColor }}
          >
            Password
          </label>
          <input
            type="text"
            placeholder="Enter your Password"
            value={passwordInput}
            className="w-full px-4 mb-6 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: borderColor }}
            onChange={(e) => {
              setPasswordInput(e.target.value);
            }}
          />
        </div>
        <button
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-[#ff4d2d] hover:bg-[#e64323]  text-white font-bold`}
          onClick={handleSignin}
        >
          Signin
        </button>
      </div>
    </div>
  );
};

export default SignIn;
