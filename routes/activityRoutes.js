import express from "express";
import { getRecentActivity } from "../controllers/activityController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/recent", protect, getRecentActivity);

export default router;