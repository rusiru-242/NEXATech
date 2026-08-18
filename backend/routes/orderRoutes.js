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
    // Prepare order items
    // ------------------------------------------------------

    const orderItems = [];

    let calculatedSubtotal = 0;

    // ------------------------------------------------------
    // Check products, stock and calculate prices
    // ------------------------------------------------------

    for (const item of items) {
      // Support:
      // item.product
      // item._id
      const productId = item.product || item._id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Invalid order item: missing product id.",
        });
      }

      // ----------------------------------------------------
      // Find product from database
      // ----------------------------------------------------

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }

      // ----------------------------------------------------
      // Validate quantity
      // ----------------------------------------------------

      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      // ----------------------------------------------------
      // Check stock
      // ----------------------------------------------------

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of ${product.name} are available.`,
        });
      }

      // ----------------------------------------------------
      // Product pricing
      //
      // Product.price = original/base price
      // Product.discount = percentage discount
      //
      // Example:
      // price = 100
      // discount = 20%
      // final price = 80
      // ----------------------------------------------------

      const originalPrice = Number(product.price) || 0;

      const discount = Math.min(
        Math.max(Number(product.discount) || 0, 0),
        100
      );

      const discountedPrice =
        originalPrice * (1 - discount / 100);

      const finalPrice = Number(
        discountedPrice.toFixed(2)
      );

      // ----------------------------------------------------
      // Calculate subtotal using SERVER price
      // ----------------------------------------------------

      calculatedSubtotal += finalPrice * quantity;

      // ----------------------------------------------------
      // Save product snapshot into order
      //
      // This protects old orders when admin later changes
      // the product price/discount.
      // ----------------------------------------------------

      orderItems.push({
        product: product._id,

        name: product.name,

        image: product.image || "",

        brand: product.brand || "",

        category: product.category || "",

        price: finalPrice,

        originalPrice,

        discount,

        quantity,
      });
    }

    // ------------------------------------------------------
    // Round subtotal
    // ------------------------------------------------------

    calculatedSubtotal = Number(
      calculatedSubtotal.toFixed(2)
    );

    // ------------------------------------------------------
    // Calculate shipping
    //
    // Current project rule:
    // subtotal >= 100 => FREE
    // subtotal < 100  => 10
    // ------------------------------------------------------

    const calculatedShippingFee =
      calculatedSubtotal >= 100 ? 0 : 10;

    // ------------------------------------------------------
    // Calculate final total
    // ------------------------------------------------------

    const calculatedTotal = Number(
      (
        calculatedSubtotal +
        calculatedShippingFee
      ).toFixed(2)
    );

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

      paymentStatus: "pending",

      status: "pending",

      subtotal: calculatedSubtotal,

      shippingFee: calculatedShippingFee,

      total: calculatedTotal,
    });

    // ------------------------------------------------------
    // Reduce stock
    // ------------------------------------------------------

    for (const item of orderItems) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: {
              stock: -item.quantity,
            },
          },
          {
            new: true,
          }
        );

      // ----------------------------------------------------
      // Safety check
      // ----------------------------------------------------

      if (!updatedProduct) {
        console.error(
          `Stock update failed for product ${item.product}`
        );

        return res.status(409).json({
          success: false,
          message:
            "Stock changed while placing the order. Please try again.",
        });
      }
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