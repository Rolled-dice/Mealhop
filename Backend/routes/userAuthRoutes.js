import express from "express";
import {
  resetPassword,
  sendOtp,
  userSignin,
  userSignout,
  userSignUp,
  verifyOtp,
  getCurrentUser,
} from "../controllers/userAuth.js";
import { verifyToken } from "../utils/token.js";

const authrouter = express.Router();
authrouter.post("/signup", userSignUp);
authrouter.post("/signin", userSignin);
authrouter.post("/signout", userSignout);
authrouter.post("/logout", userSignout);
authrouter.get("/me", verifyToken, getCurrentUser);
authrouter.post("/send-otp", sendOtp);
authrouter.post("/verify-otp", verifyOtp);
authrouter.post("/reset-password", resetPassword);
export default authrouter;
