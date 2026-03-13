import express from "express";
import {
  ownerDashboard,
  tenantDashboard
} from "../controllers/dashboardController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Owner dashboard */

router.get(
  "/owner",
  protect,
  authorizeRoles("OWNER"),
  ownerDashboard
);

/* Tenant dashboard */

router.get(
  "/tenant/:tenantId",
  protect,
  authorizeRoles("TENANT", "OWNER"),
  tenantDashboard
);

export default router;
