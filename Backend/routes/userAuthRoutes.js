import express from "express";
import {
  userSignin,
  userSignout,
  userSignUp,
} from "../controllers/userAuth.js";
const authrouter = express.Router();
authrouter.post("/signup", userSignUp);
authrouter.post("/signin", userSignin);
authrouter.post("/signout", userSignout);
export default authrouter;
