import express from "express";
import {
  resetPassword,
  sendOtp,
  userSignin,
  userSignout,
  userSignUp,
  verifyOtp,
} from "../controllers/userAuth.js";
const authrouter = express.Router();
authrouter.post("/signup", userSignUp);
authrouter.post("/signin", userSignin);
authrouter.post("/signout", userSignout);
authrouter.post("/send-otp", sendOtp);
authrouter.post("/verify-otp", verifyOtp);
authrouter.post("/reset-password", resetPassword);
export default authrouter;
