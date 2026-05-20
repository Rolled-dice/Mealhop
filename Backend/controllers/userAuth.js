import z from "zod";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import userToken from "../utils/token.js";
import { sendOtpEmail } from "../utils/mail.js";

const signupSchema = z.object({
  Fullname: z.string().min(1, "Fullname is required"),
  Email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  PhoneNumber: z.string().optional(),
  role: z.string().optional(),
});

export const userSignUp = async (req, res) => {
  try {
    // Validate using Zod
    const data = signupSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).json({ message: data.error.issues?.[0]?.message || "Validation failed" });
    }

    const { Fullname, Email, password, PhoneNumber, role } = data.data;

    // Check existing user
    const existing = await User.findOne({ Email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashpassword = bcrypt.hashSync(password, 10);

    // Create user
    const user = new User({
      Fullname,
      Email,
      password: hashpassword,
      PhoneNumber,
      role,
    });

    await user.save();

    // Generate token
    const gentoken = userToken(user._id);

    // Set cookie
    res.cookie("token", gentoken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

export const userSignin = async (req, res) => {
  try {
    const { Email, password } = req.body;

    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const gentoken = userToken(user._id);

    res.cookie("token", gentoken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ message: "Signin successful", user });
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

export const userSignout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Signout successful" });
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    user.resetOtp = otp;
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //5 minutes from now
    user.otpExpiry = otpExpiry;
    user.isOtpVerified = false;
    await user.save();
    await sendOtpEmail(Email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json(`message: "internal server error", ${err} `);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { Email, otp } = req.body;

    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.resetOtp || !user.otpExpiry) {
      return res.status(400).json({ msg: "OTP not requested" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (otp !== user.resetOtp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpiry = undefined;

    await user.save();
    return res.status(200).json({ msg: "OTP verified successfully" });
  } catch (err) {
    return res.status(500).json({
      msg: "Verify OTP error",
      error: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { Email, password } = req.body;
    const user = await User.findOne({ Email });
    if (!user.isOtpVerified || !user) {
      return res.status(400).json({ msg: "Invalid email/otp error" });
    }
    const pass = await bcrypt.hash(password, 10);
    user.password = pass;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ msg: "Password reset Sucessfully" });
  } catch (err) {
    return res.status(500).json(` Email/otp error ${err.message}`);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};
