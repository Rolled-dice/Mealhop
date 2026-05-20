import express from "express";
import { verifyToken } from "../utils/token.js";
import { getAnalytics } from "../controllers/ownerController.js";

const router = express.Router();
router.use(verifyToken);

router.get("/analytics", getAnalytics);

export default router;
