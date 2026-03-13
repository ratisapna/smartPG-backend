import express from "express";
import {
  createPayment,
  getPayments
} from "../controllers/paymentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPayment);

router.get("/", protect, getPayments);

export default router;