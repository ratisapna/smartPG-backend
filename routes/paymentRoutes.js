import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPayments
} from "../controllers/paymentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);

router.get("/", protect, getPayments);

export default router;