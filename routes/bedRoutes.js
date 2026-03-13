import express from "express";
import {
  getBedsByRoom,
  updateBed,
  deleteBed
} from "../controllers/bedController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Get all beds of a room */
router.get("/room/:roomId", protect, authorizeRoles("OWNER"), getBedsByRoom);

/* Update bed */
router.patch("/:bedId", protect, authorizeRoles("OWNER"), updateBed);

/* Delete bed */
router.delete("/:bedId", protect, authorizeRoles("OWNER"), deleteBed);

export default router;