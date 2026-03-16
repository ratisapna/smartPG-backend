import express from "express";
import {
  generateFees,
  getFees,
  getTenantFees,
  getMyFees,
  markFeeAsPaid
} from "../controllers/feesController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Generate monthly fees */
router.post("/generate", protect, authorizeRoles("OWNER"), generateFees);

/* Get all fees */
router.get("/", protect, authorizeRoles("OWNER"), getFees);

/* Get tenant fees */
router.get("/tenant/:tenantId", protect, getTenantFees);

/* Get my fees (Tenant) */
router.get("/my", protect, getMyFees);

/* Mark fee as paid (Owner) */
router.post("/mark-paid", protect, authorizeRoles("OWNER"), markFeeAsPaid);

export default router;