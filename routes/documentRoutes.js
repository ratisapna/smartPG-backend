import express from "express";

import {
  createDocument,
  getTenantDocuments,
  verifyDocument
} from "../controllers/documentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

import { documentValidator } from "../validators/documentValidator.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

/* Tenant uploads document */

router.post("/", protect, documentValidator, validate, createDocument);

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