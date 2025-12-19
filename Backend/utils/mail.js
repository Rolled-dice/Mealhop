import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.PASS, // generated ethereal password",
  },
});

// Wrap in an async IIFE so we can use await.
export const sendOtpEmail = async (to, otp) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset Your Password - MealHop",
    // text: "Hello world?", // plain‑text body
    html: `<P>
        Your OTP for Password Reset.<b>${otp}</b>.Its get expired in 5 minutes
      </P>`, // HTML body
  });

  console.log("Message sent:", info.messageId);
};
