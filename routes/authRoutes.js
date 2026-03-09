import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

console.log("Auth routes loaded");   // DEBUG

router.post("/register", register);

router.post("/login", login);

export default router;