import express from "express";

import {
  createDocument,
  getTenantDocuments,
  verifyDocument
} from "../controllers/documentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Tenant uploads document */

router.post("/", protect, createDocument);

/* Get tenant documents */

router.get("/tenant/:tenantId", protect, getTenantDocuments);

/* Owner verifies document */

router.patch(
  "/:docId",
  protect,
  authorizeRoles("OWNER"),
  verifyDocument
);

export default router;