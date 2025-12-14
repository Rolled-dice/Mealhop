import React from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { url } from "../App";
import axios from "axios";
const SignUp = () => {
  const navigate = useNavigate();
  const [password, showPassword] = React.useState(false);
  const [role, setRole] = React.useState("user");
  const [Fullname, setFullName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [PhoneNumber, setPhoneNumber] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const primaryColor = "#ff4d2d"; // Indigo-600
  const hoverColor = "#e64323"; // Indigo-700
  const bgcolor = "#fff9f6"; // Indigo-50
  const borderColor = "#ddd"; // Indigo-200

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        `${url}/api/auth/signup`,
        {
          Fullname,
          Email,
          password: passwordInput,
          PhoneNumber,
          role,
        },
        { withCredentials: true }
      );
      console.log("Signup Success:", res.data); // ✅ ADD THIS
    } catch (error) {
      console.log("Signup Error:", error);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: bgcolor }}
    >
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
          Create your account to get started with delicious food deliveries.
        </h3>
        {/* <form className="space-y-4"> */}
        <div>
          <label
            className="block text-2xl mb-1 font-medium"
            style={{ color: primaryColor }}
          >
            FullName
          </label>
          <input
            type="text"
            value={Fullname}
            placeholder="Enter your Full Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: borderColor }}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
        </div>
        <div>
          <label
            className="block text-2xl mb-1 font-medium"
            style={{ color: primaryColor }}
          >
            Email
          </label>
          <input
            type="email"
            value={Email}
            placeholder="Enter your Email"
            className="w-full  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
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
            PhoneNumber
          </label>
          <input
            type="text"
            value={PhoneNumber}
            placeholder="Enter your Phone Number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: borderColor }}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
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
          <div className="relative">
            <input
              type={password ? "text" : "password"}
              value={passwordInput}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: borderColor }}
              onChange={(e) => {
                setPasswordInput(e.target.value);
              }}
            />
            <button
              className="absolute right-3 top-3.5 text-gray-600 cursor-pointer"
              onClick={() => showPassword((prev) => !prev)}
            >
              {!password ? <FaEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>
        <div>
          <label
            className="block text-2xl mb-3 font-medium"
            style={{ color: primaryColor }}
          >
            Role
          </label>
          {["user", "owner", "deliveryBoy"].map((r) => {
            return (
              <button
                className="flex-1 mr-10 px-4 py-2 border rounded-lg text-center font-medium
                   transition-colors cursor-pointer "
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: hoverColor, color: "#fff" }
                    : { backgroundColor: "#fff", color: primaryColor }
                }
              >
                {r}
              </button>
            );
          })}
        </div>
        <div>
          <button
            className={`w-full mb-6 mt-6 px-4 py-2 rounded-lg text-white font-bold
                   transition duration-300 bg-[#ff4d2d] hover:opacity-70 cursor-pointer`}
            style={{ backgroundColor: primaryColor }}
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>

        <div className="w-full space-x-1 mt-4 flex items-center justify-center px-4 py-2 border rounded-lg text-center font-medium transition duration-200 border-gray-400 hover:border-gray-100 cursor-pointer ">
          <FcGoogle />
          <span>Sign up with Google</span>
        </div>
        <div
          className="w-full mt-4 flex items-center justify-center px-4 py-2 border rounded-lg text-center font-medium transition duration-200 border-gray-400 hover:border-gray-100 cursor-pointer "
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-blue-500">Sign In</span>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default SignUp;
