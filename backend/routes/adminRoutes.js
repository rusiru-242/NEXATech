const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================
// ADMIN DASHBOARD TEST
// GET /api/admin
// ==========================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to NexaTech Admin Panel",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;