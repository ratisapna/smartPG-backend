import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  roomAvailability,
  getPublicRooms,
  getRoomUploadUrl
} from "../controllers/roomController.js";
import { roomValidator } from "../validators/roomValidator.js";
import { validate } from "../validators/validate.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/* Public: Get all rooms with PG info */
router.get("/public", getPublicRooms);


/* Create Room */
router.post("/", protect, authorizeRoles("OWNER"), roomValidator, validate, createRoom);

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
router.post("/upload-url", protect, authorizeRoles("OWNER"), getRoomUploadUrl);


export default router;