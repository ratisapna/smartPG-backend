import express from "express";
import {
  createPG,
  getPG,
  updatePG,
  deletePG
} from "../controllers/pgController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Create PG */
router.post("/", protect, authorizeRoles("OWNER"), createPG);

/* Get PG details */
router.get("/", protect, authorizeRoles("OWNER"), getPG);

/* Update PG */
router.patch("/", protect, authorizeRoles("OWNER"), updatePG);

/* Delete PG */
router.delete("/", protect, authorizeRoles("OWNER"), deletePG);

export default router;