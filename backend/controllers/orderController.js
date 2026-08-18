const Order = require("../models/Order");

// ==============================
// GET MY ORDERS
// GET /api/orders/my-orders
// ==============================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};

// ==============================
// GET SINGLE ORDER
// GET /api/orders/:id
// ==============================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching order",
    });
  }
};

// ==============================
// CREATE ORDER
// POST /api/orders
// ==============================
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      total,
    } = req.body;

    // ==============================
    // Validate items
    // ==============================
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // ==============================
    // Validate shipping address
    // ==============================
    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping name and address are required",
      });
    }

    // ==============================
    // Create order
    // ==============================
    const order = await Order.create({
      user: req.user._id,

      items,

      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone || "",
        address: shippingAddress.address,
        city: shippingAddress.city || "",
      },

      paymentMethod: paymentMethod || "cod",

      paymentStatus:
        paymentMethod === "card" ? "pending" : "pending",

      status: "pending",

      subtotal: Number(subtotal) || 0,

      shippingFee: Number(shippingFee) || 0,

      total: Number(total) || 0,
    });

    // ==============================
    // Return created order
    // ==============================
    const populatedOrder = await Order.findById(order._id).populate(
      "items.product"
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
};

// ==============================
// CANCEL MY ORDER
// PUT /api/orders/:id/cancel
// ==============================
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Only pending/processing orders can be cancelled
    if (
      order.status !== "pending" &&
      order.status !== "processing"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled",
      });
    }

    order.status = "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while cancelling order",
    });
  }
};

// ==============================
// EXPORT
// ==============================
module.exports = {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
};