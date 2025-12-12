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
export default userToken;
