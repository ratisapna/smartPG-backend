import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  roomAvailability
} from "../controllers/roomController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Create Room */
router.post("/", protect, authorizeRoles("OWNER"), createRoom);

/* Get all rooms */
router.get("/", protect, authorizeRoles("OWNER"), getRooms);

/* Get room by ID */
router.get("/:roomId", protect, authorizeRoles("OWNER"), getRoomById);

/* Update room */
router.patch("/:roomId", protect, authorizeRoles("OWNER"), updateRoom);

/* Delete room */
router.delete("/:roomId", protect, authorizeRoles("OWNER"), deleteRoom);

/* Room availability */

router.get(
  "/availability/beds",
  protect,
  authorizeRoles("OWNER"),
  roomAvailability
);


export default router;