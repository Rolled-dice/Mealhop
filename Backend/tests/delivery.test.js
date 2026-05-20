import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

const ownerData = { Fullname: "Del Owner", Email: `delowner${Date.now()}@mealhop.com`, password: "Owner@1234", role: "owner" };
const userData = { Fullname: "Del User", Email: `deluser${Date.now()}@mealhop.com`, password: "User@1234", role: "user" };
const deliveryData = { Fullname: "Del Boy", Email: `delboy${Date.now()}@mealhop.com`, password: "Del@1234", role: "deliveryBoy" };

let ownerCookie, userCookie, deliveryCookie, restaurantId, orderId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mealhop_test");

  // Setup owner + restaurant
  let res = await request(app).post("/api/auth/signup").send(ownerData);
  ownerCookie = res.headers["set-cookie"];
  res = await request(app).post("/api/restaurants").set("Cookie", ownerCookie).send({ name: "Del Test Kitchen", cuisine: ["Thai"] });
  restaurantId = res.body.restaurant._id;

  // Create user + place order
  res = await request(app).post("/api/auth/signup").send(userData);
  userCookie = res.headers["set-cookie"];
  res = await request(app).post("/api/orders").set("Cookie", userCookie).send({
    restaurantId,
    items: [{ name: "Pad Thai", price: 200, quantity: 1 }],
    deliveryAddress: { city: "Mumbai" },
  });
  orderId = res.body.order._id;

  // Mark order as ready (so delivery can see it)
  await request(app).patch(`/api/orders/${orderId}/status`).set("Cookie", ownerCookie).send({ status: "ready" });

  // Create delivery boy
  res = await request(app).post("/api/auth/signup").send(deliveryData);
  deliveryCookie = res.headers["set-cookie"];
});

afterAll(async () => {
  await mongoose.connection.collection("users").deleteMany({ Email: { $in: [ownerData.Email, userData.Email, deliveryData.Email] } });
  await mongoose.connection.collection("restaurants").deleteMany({ name: "Del Test Kitchen" });
  await mongoose.connection.collection("orders").deleteMany({ _id: new mongoose.Types.ObjectId(orderId) });
  await mongoose.disconnect();
});

describe("Delivery API", () => {
  describe("GET /api/delivery/orders/available", () => {
    it("should return available orders for delivery boy", async () => {
      const res = await request(app).get("/api/delivery/orders/available").set("Cookie", deliveryCookie);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.orders)).toBe(true);
    });

    it("should reject non-delivery user", async () => {
      const res = await request(app).get("/api/delivery/orders/available").set("Cookie", userCookie);
      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/delivery/orders/:orderId/accept", () => {
    it("should accept an order", async () => {
      const res = await request(app)
        .post(`/api/delivery/orders/${orderId}/accept`)
        .set("Cookie", deliveryCookie);
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("picked_up");
    });

    it("should reject already assigned order", async () => {
      const res = await request(app)
        .post(`/api/delivery/orders/${orderId}/accept`)
        .set("Cookie", deliveryCookie);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/delivery/orders/my", () => {
    it("should return delivery boy's assigned orders", async () => {
      const res = await request(app).get("/api/delivery/orders/my").set("Cookie", deliveryCookie);
      expect(res.status).toBe(200);
      expect(res.body.orders.length).toBeGreaterThan(0);
    });
  });

  describe("PATCH /api/delivery/orders/:orderId/status", () => {
    it("should update to delivered", async () => {
      const res = await request(app)
        .patch(`/api/delivery/orders/${orderId}/status`)
        .set("Cookie", deliveryCookie)
        .send({ status: "delivered" });
      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe("delivered");
    });

    it("should reject invalid status", async () => {
      const res = await request(app)
        .patch(`/api/delivery/orders/${orderId}/status`)
        .set("Cookie", deliveryCookie)
        .send({ status: "preparing" });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/delivery/earnings", () => {
    it("should return earnings", async () => {
      const res = await request(app).get("/api/delivery/earnings").set("Cookie", deliveryCookie);
      expect(res.status).toBe(200);
      expect(res.body.totalEarnings).toBeGreaterThanOrEqual(0);
      expect(res.body.totalDeliveries).toBeGreaterThanOrEqual(0);
    });

    it("should filter by period", async () => {
      const res = await request(app).get("/api/delivery/earnings?period=today").set("Cookie", deliveryCookie);
      expect(res.status).toBe(200);
      expect(res.body.period).toBe("today");
    });
  });
});
