import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

const ownerData = {
  Fullname: "Test Owner",
  Email: `owner${Date.now()}@mealhop.com`,
  password: "Owner@1234",
  role: "owner",
};

let ownerCookie;
let menuItemId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mealhop_test");
  const res = await request(app).post("/api/auth/signup").send(ownerData);
  ownerCookie = res.headers["set-cookie"];
});

afterAll(async () => {
  await mongoose.connection.collection("users").deleteMany({ Email: ownerData.Email });
  await mongoose.connection.collection("restaurants").deleteMany({ name: "Test Kitchen" });
  await mongoose.disconnect();
});

describe("Restaurant API", () => {
  describe("POST /api/restaurants", () => {
    it("should create a restaurant for owner", async () => {
      const res = await request(app)
        .post("/api/restaurants")
        .set("Cookie", ownerCookie)
        .send({ name: "Test Kitchen", cuisine: ["Indian"], address: { city: "Delhi" } });
      expect(res.status).toBe(201);
      expect(res.body.restaurant.name).toBe("Test Kitchen");
    });

    it("should reject duplicate restaurant for same owner", async () => {
      const res = await request(app)
        .post("/api/restaurants")
        .set("Cookie", ownerCookie)
        .send({ name: "Another", cuisine: ["Chinese"] });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/restaurants", () => {
    it("should list all restaurants", async () => {
      const res = await request(app).get("/api/restaurants");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.restaurants)).toBe(true);
    });

    it("should filter by search", async () => {
      const res = await request(app).get("/api/restaurants?search=Test");
      expect(res.status).toBe(200);
      expect(res.body.restaurants.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/restaurants/owner/me", () => {
    it("should return owner's restaurant", async () => {
      const res = await request(app).get("/api/restaurants/owner/me").set("Cookie", ownerCookie);
      expect(res.status).toBe(200);
      expect(res.body.restaurant.name).toBe("Test Kitchen");
    });
  });

  describe("Menu CRUD", () => {
    it("POST /api/restaurants/menu - should add menu item", async () => {
      const res = await request(app)
        .post("/api/restaurants/menu")
        .set("Cookie", ownerCookie)
        .send({ name: "Butter Chicken", price: 250, category: "main" });
      expect(res.status).toBe(201);
      expect(res.body.item.name).toBe("Butter Chicken");
      menuItemId = res.body.item._id;
    });

    it("PUT /api/restaurants/menu/:id - should update menu item", async () => {
      const res = await request(app)
        .put(`/api/restaurants/menu/${menuItemId}`)
        .set("Cookie", ownerCookie)
        .send({ price: 300 });
      expect(res.status).toBe(200);
      expect(res.body.item.price).toBe(300);
    });

    it("DELETE /api/restaurants/menu/:id - should delete menu item", async () => {
      const res = await request(app)
        .delete(`/api/restaurants/menu/${menuItemId}`)
        .set("Cookie", ownerCookie);
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/restaurants", () => {
    it("should update restaurant details", async () => {
      const res = await request(app)
        .put("/api/restaurants")
        .set("Cookie", ownerCookie)
        .send({ description: "Best food in town" });
      expect(res.status).toBe(200);
      expect(res.body.restaurant.description).toBe("Best food in town");
    });
  });
});
