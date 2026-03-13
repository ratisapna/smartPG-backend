import express from "express";
import {
  createVisitRequest,
  getVisitRequests,
  updateVisitStatus
} from "../controllers/visitrequestController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Visitor submits request (public) */

router.post("/", createVisitRequest);

/* Owner views requests */

router.get("/", protect, authorizeRoles("OWNER"), getVisitRequests);

/* Owner approves / rejects */

router.patch("/:id", protect, authorizeRoles("OWNER"), updateVisitStatus);

export default router;
