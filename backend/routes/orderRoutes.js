const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================================
// CREATE ORDER
// POST /api/orders
// ==========================================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      total,
    } = req.body;

    // ------------------------------------------------------
    // Validate items
    // ------------------------------------------------------

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product.",
      });
    }

    // ------------------------------------------------------
    // Validate shipping information
    // ------------------------------------------------------

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping information is required.",
      });
    }

    // ------------------------------------------------------
    // Validate payment method
    // ------------------------------------------------------

    if (!["cod", "card"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    // ------------------------------------------------------
    // Check products and stock
    // ------------------------------------------------------

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of ${product.name} are available.`,
        });
      }

      // ----------------------------------------------------
      // Save current product information into order
      // ----------------------------------------------------

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      });
    }

    // ------------------------------------------------------
    // Create order
    // ------------------------------------------------------

    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
      },

      paymentMethod,

      paymentStatus:
        paymentMethod === "cod"
          ? "pending"
          : "pending",

      status: "pending",

      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      total: Number(total),
    });

    // ------------------------------------------------------
    // Reduce stock
    // ------------------------------------------------------

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // ------------------------------------------------------
    // Response
    // ------------------------------------------------------

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: {
        _id: order._id,
        user: order.user,
        items: order.items,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        total: order.total,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to place order.",
      error: error.message,
    });
  }
});

// ==========================================================
// GET MY ORDERS
// GET /api/orders/my
// ==========================================================

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders.",
    });
  }
});

// ==========================================================
// GET SINGLE MY ORDER
// GET /api/orders/:id
// ==========================================================

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
});

module.exports = router;