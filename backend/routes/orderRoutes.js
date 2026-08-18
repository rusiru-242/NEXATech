const express = require("express");

const {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// GET MY ORDERS
// GET /api/orders/my-orders
// ==============================
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// ==============================
// GET SINGLE ORDER
// GET /api/orders/:id
// ==============================
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

// ==============================
// CREATE ORDER
// POST /api/orders
// ==============================
router.post(
  "/",
  authMiddleware,
  createOrder
);

// ==============================
// CANCEL ORDER
// PUT /api/orders/:id/cancel
// ==============================
router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

module.exports = router;