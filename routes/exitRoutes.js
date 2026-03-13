import express from "express";

import {
  createExitRequest,
  getExitRequests,
  updateExitRequest
} from "../controllers/exitController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Tenant creates exit request */

router.post("/", protect, authorizeRoles("TENANT"), createExitRequest);

/* Owner views exit requests */

router.get("/", protect, authorizeRoles("OWNER"), getExitRequests);

/* Owner approves/rejects */

router.patch("/:id", protect, authorizeRoles("OWNER"), updateExitRequest);

export default router;