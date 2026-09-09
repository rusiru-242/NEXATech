const express = require("express");
const router = express.Router();

// ============================================================
// AI Proxy Routes
// Forwards browser chat requests to the internal FastAPI service.
// FastAPI is NOT publicly exposed — all AI traffic routes through here.
// ============================================================

const PYTHON_API_URL =
  process.env.PYTHON_API_URL || "http://localhost:8000";

/**
 * POST /api/ai/chat
 * Proxy to FastAPI POST /chat
 * Preserves the original request body and response exactly.
 */
router.post("/chat", async (req, res) => {
  try {
    const response = await fetch(`${PYTHON_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("AI proxy error:", error.message);
    res.status(502).json({
      success: false,
      reply: "AI service is temporarily unavailable. Please try again shortly.",
    });
  }
});

/**
 * GET /api/ai/health
 * Proxy to FastAPI GET /health
 */
router.get("/health", async (req, res) => {
  try {
    const response = await fetch(`${PYTHON_API_URL}/health`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ status: "unavailable", error: error.message });
  }
});

module.exports = router;
