const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ==============================
// Connect MongoDB
// ==============================
connectDB();

// ==============================
// Middleware
// ==============================
// Allow CORS from the client during development. If `CLIENT_URL` is set in
// the env, use that. Otherwise reflect the request origin (works across dev
// ports) while keeping `credentials: true`.
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Test Route
// ==============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NexaTech Backend is running",
  });
});

// ==============================
// Authentication Routes
// ==============================
app.use("/api/auth", authRoutes);

// ==============================
// 404 Route
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NexaTech Backend running on port ${PORT}`);
});