import jwt from "jsonwebtoken";

const userToken = (userId) => {
  try {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.log("Error generating token:", error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Also get user role from database
    const { User } = await import("../models/userModel.js");
    const user = await User.findById(decoded.id).select("role");
    if (user) {
      req.userRole = user.role;
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default userToken;
