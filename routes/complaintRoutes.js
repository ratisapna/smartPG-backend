import express from "express";
import {
  createComplaint,
  getComplaints,
  updateComplaint
} from "../controllers/complaintController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComplaint);

router.get("/", protect, getComplaints);

router.patch("/:id", protect, updateComplaint);

export default router;
