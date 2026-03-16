import express from "express";
import {
  createPG,
  getPG,
  updatePG,
  deletePG,
  getPGUploadUrl,
  getAllPGs
} from "../controllers/pgController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Public listing */
router.get("/all", getAllPGs);

/* Create PG */
router.post("/", protect, authorizeRoles("OWNER"), createPG);

/* Get owner's PG details */
router.get("/", protect, authorizeRoles("OWNER"), getPG);

/* Update PG */
router.patch("/", protect, authorizeRoles("OWNER"), updatePG);

/* Delete PG */
router.delete("/", protect, authorizeRoles("OWNER"), deletePG);

/* Get upload URL */
router.post("/upload-url", protect, authorizeRoles("OWNER"), getPGUploadUrl);

export default router;