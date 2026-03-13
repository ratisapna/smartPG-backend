import express from "express";
import {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant
} from "../controllers/tenantController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Create tenant */
router.post("/", protect, authorizeRoles("OWNER"), createTenant);

/* Get all tenants */
router.get("/", protect, authorizeRoles("OWNER"), getTenants);

/* Get tenant by ID */
router.get("/:tenantId", protect, authorizeRoles("OWNER"), getTenantById);

/* Update tenant */
router.patch("/:tenantId", protect, authorizeRoles("OWNER"), updateTenant);

/* Delete tenant */
router.delete("/:tenantId", protect, authorizeRoles("OWNER"), deleteTenant);

export default router;
