import z from "zod";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import userToken from "../utils/token.js";

const signupSchema = z.object({
  Fullname: z.string().min(1, "Fullname is required"),
  Email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  PhoneNumber: z.string().optional(),
  role: z.string().optional(),
});

export const userSignUp = async (req, res) => {
  try {
    // Validate using Zod
    const data = signupSchema.safeParse(req.body);
    if (!data.success) {
      return res.status(400).json({ message: data.error.errors[0].message });
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
      secure: false,
      sameSite: "strict",
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
      secure: false,
      sameSite: "strict",
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
