const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// ==============================
// Connect MongoDB
// ==============================
connectDB();

// ==============================
// CORS
// ==============================
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

// ==========================================================
// STRIPE WEBHOOK
// IMPORTANT:
// This route MUST receive the raw request body.
// It must be registered BEFORE express.json().
// ==========================================================
app.use(
  "/api/payments/webhook",
  express.raw({
    type: "application/json",
  })
);

// ==============================
// Body Parsers
// ==============================
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
// Customer Order Routes
// ==============================
app.use("/api/orders", orderRoutes);

// ==============================
// Product Routes
// ==============================
app.use("/api/products", productRoutes);

// ==============================
// Admin Routes
// ==============================
app.use("/api/admin", adminRoutes);

// ==============================
// Review Routes
// ==============================
app.use("/api/reviews", reviewRoutes);

// ==============================
// Payment Routes
// ==============================
// Includes:
// POST /api/payments/create-checkout-session
// POST /api/payments/webhook
app.use("/api/payments", paymentRoutes);

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