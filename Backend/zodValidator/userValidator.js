import z from "zod";

export const userCredValidator = z.object({
  Fullname: z.string().nonempty({ message: "Fullname is required" }),
  Email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  PhoneNumber: z.string().optional(),
  role: z.enum(["user", "owner", "deliveryBoy"], {
    message: "Role must be one of: user, owner, deliveryBoy",
  }),
});
