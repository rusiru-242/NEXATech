const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// ===============================
// MongoDB
// ===============================

connectDB();

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());

// ===============================
// Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "NexaTech Backend is running",
  });
});

// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `NexaTech Backend running on port ${PORT}`
  );
});