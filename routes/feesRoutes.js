import express from "express";
import {
  generateFees,
  getFees,
  getTenantFees
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

export default router;