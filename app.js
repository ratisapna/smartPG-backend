// app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import pgRoutes from "./routes/pgRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import feesRoutes from "./routes/feesRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bedRoutes from "./routes/bedRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import exitRoutes from "./routes/exitRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";


const app = express();

/* ---------- Security Middlewares ---------- */

app.use(helmet());
app.use(cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "1kb" }));

/* ---------- Health Route ---------- */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});


/* ---------- API Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/pg", pgRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/beds",bedRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/exits", exitRoutes);
app.use("/api/activity", activityRoutes);



/* ---------- 404 Handler ---------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ---------- Global Error Handler ---------- */

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;