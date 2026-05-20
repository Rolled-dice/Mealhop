import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";

const testUser = {
  Fullname: "Test User",
  Email: `test${Date.now()}@mealhop.com`,
  password: "Test@1234",
  PhoneNumber: "9876543210",
  role: "user",
};

let cookie;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mealhop_test");
});

afterAll(async () => {
  await mongoose.connection.collection("users").deleteMany({ Email: testUser.Email });
  await mongoose.disconnect();
});

describe("Auth API", () => {
  describe("POST /api/auth/signup", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Signup successful");
      expect(res.body.user.Email).toBe(testUser.Email);
    });

    it("should reject duplicate email", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });

    it("should reject invalid email", async () => {
      const res = await request(app).post("/api/auth/signup").send({ ...testUser, Email: "bad" });
      expect(res.status).toBe(400);
    });

    it("should reject short password", async () => {
      const res = await request(app).post("/api/auth/signup").send({ ...testUser, Email: "x@y.com", password: "123" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/auth/signin", () => {
    it("should sign in with valid credentials", async () => {
      const res = await request(app).post("/api/auth/signin").send({ Email: testUser.Email, password: testUser.password });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Signin successful");
      cookie = res.headers["set-cookie"];
    });

    it("should reject wrong password", async () => {
      const res = await request(app).post("/api/auth/signin").send({ Email: testUser.Email, password: "wrong" });
      expect(res.status).toBe(400);
    });

    it("should reject non-existent user", async () => {
      const res = await request(app).post("/api/auth/signin").send({ Email: "no@exist.com", password: "x" });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return current user when authenticated", async () => {
      const res = await request(app).get("/api/auth/me").set("Cookie", cookie);
      expect(res.status).toBe(200);
      expect(res.body.user.Email).toBe(testUser.Email);
    });

    it("should reject unauthenticated request", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear cookie and log out", async () => {
      const res = await request(app).post("/api/auth/logout").set("Cookie", cookie);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Signout successful");
    });
  });
});
