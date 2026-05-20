import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

const ownerData = { Fullname: "Order Owner", Email: `orderowner${Date.now()}@mealhop.com`, password: "Owner@1234", role: "owner" };
const userData = { Fullname: "Order User", Email: `orderuser${Date.now()}@mealhop.com`, password: "User@1234", role: "user" };

let ownerCookie, userCookie, restaurantId, orderId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mealhop_test");

  // Create owner + restaurant
  let res = await request(app).post("/api/auth/signup").send(ownerData);
  ownerCookie = res.headers["set-cookie"];
  res = await request(app).post("/api/restaurants").set("Cookie", ownerCookie).send({ name: "Order Test Kitchen", cuisine: ["Italian"] });
  restaurantId = res.body.restaurant._id;

  // Add menu item
  await request(app).post("/api/restaurants/menu").set("Cookie", ownerCookie).send({ name: "Pizza", price: 300, category: "main" });

  // Create user
  res = await request(app).post("/api/auth/signup").send(userData);
  userCookie = res.headers["set-cookie"];
});

afterAll(async () => {
  await mongoose.connection.collection("users").deleteMany({ Email: { $in: [ownerData.Email, userData.Email] } });
  await mongoose.connection.collection("restaurants").deleteMany({ name: "Order Test Kitchen" });
  await mongoose.connection.collection("orders").deleteMany({ restaurantId: new mongoose.Types.ObjectId(restaurantId) });
  await mongoose.disconnect();
});

describe("Order API", () => {
  describe("POST /api/orders", () => {
    it("should place an order", async () => {
      const res = await request(app)
        .post("/api/orders")
        .set("Cookie", userCookie)
        .send({
          restaurantId,
          items: [{ name: "Pizza", price: 300, quantity: 2 }],
          deliveryAddress: { city: "Delhi" },
        });
      expect(res.status).toBe(201);
      expect(res.body.order.totalAmount).toBe(630); // 300*2 + 30 delivery
      orderId = res.body.order._id;
    });

    it("should reject without auth", async () => {
      const res = await request(app).post("/api/orders").send({ restaurantId, items: [] });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/orders/my", () => {
    it("should return user's orders", async () => {
      const res = await request(app).get("/api/orders/my").set("Cookie", userCookie);
      expect(res.status).toBe(200);
      expect(res.body.orders.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/orders/:id", () => {
    it("should return order details", async () => {
      const res = await request(app).get(`/api/orders/${orderId}`).set("Cookie", userCookie);
      expect(res.status).toBe(200);
      expect(res.body.order._id).toBe(orderId);
    });
  });

  describe("GET /api/orders/owner/all", () => {
    it("should return orders for owner's restaurant", async () => {
      const res = await request(app).get("/api/orders/owner/all").set("Cookie", ownerCookie);
      expect(res.status).toBe(200);
      expect(res.body.orders.length).toBeGreaterThan(0);
    });

    it("should reject non-owner", async () => {
      const res = await request(app).get("/api/orders/owner/all").set("Cookie", userCookie);
      expect(res.status).toBe(403);
    });
  });

  describe("PATCH /api/orders/:id/status", () => {
    it("should update order status to preparing", async () => {
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set("Cookie", ownerCookie)
        .send({ status: "preparing" });
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("preparing");
    });

    it("should update to ready", async () => {
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set("Cookie", ownerCookie)
        .send({ status: "ready" });
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("ready");
    });

    it("should reject invalid status", async () => {
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set("Cookie", ownerCookie)
        .send({ status: "invalid" });
      expect(res.status).toBe(400);
    });
  });
});
