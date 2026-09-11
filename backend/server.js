const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const aiChatRoutes = require("./routes/aiChatRoutes");
const aiProxyRoutes = require("./routes/aiProxyRoutes");

const app = express();

// ==============================
// Connect MongoDB
// ==============================
connectDB();

// ==============================
// CORS
// ==============================
const rawOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
].filter(Boolean);

const allowedOrigins = rawOrigins.map((o) => o.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
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
// AI Chat History Routes
// ==============================
app.use("/api/ai-chats", aiChatRoutes);

// ==============================
// AI Proxy Routes
// Proxies /api/ai/* to internal FastAPI service (port 8000)
// FastAPI is never exposed publicly — all AI traffic goes through here
// ==============================
app.use("/api/ai", aiProxyRoutes);

// ==============================
// Serve React Production Build
// Place AFTER all /api routes so the SPA fallback never intercepts API calls
// ==============================
const clientDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  // React Router fallback — serve index.html for any non-API path (Express 5 compatible)
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  // Development fallback: simple 404 for unknown routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
    });
  });
}

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

// Bind to 0.0.0.0 so Docker container can accept external connections on port 7860
app.listen(PORT, "0.0.0.0", () => {
  console.log(`NexaTech Backend running on port ${PORT}`);
});