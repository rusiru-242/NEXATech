const express = require("express");
const Stripe = require("stripe");

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ======================================================
// CREATE STRIPE CHECKOUT SESSION
// POST /api/payments/create-checkout-session
// ======================================================

router.post(
  "/create-checkout-session",
  authMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID is required.",
        });
      }

      // --------------------------------------------------
      // Find order
      // --------------------------------------------------

      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      // --------------------------------------------------
      // Check payment status
      // --------------------------------------------------

      if (order.paymentStatus === "paid") {
        return res.status(400).json({
          success: false,
          message: "This order has already been paid.",
        });
      }

      // --------------------------------------------------
      // Convert order items to Stripe line items
      // --------------------------------------------------

      const lineItems = order.items.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,
            images:
              item.image && item.image.startsWith("http")
                ? [item.image]
                : [],
          },

          unit_amount: Math.round(
            Number(item.price) * 100
          ),
        },

        quantity: item.quantity,
      }));

      // --------------------------------------------------
      // Add shipping as separate line item
      // --------------------------------------------------

      if (Number(order.shippingFee) > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",

            product_data: {
              name: "Shipping",
            },

            unit_amount: Math.round(
              Number(order.shippingFee) * 100
            ),
          },

          quantity: 1,
        });
      }

      // --------------------------------------------------
      // Create Stripe Checkout Session
      // --------------------------------------------------

      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",

          payment_method_types: ["card"],

          customer_email:
            req.user.email,

          line_items: lineItems,

          metadata: {
            orderId: order._id.toString(),
            userId: req.user._id.toString(),
          },

          success_url:
            `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

          cancel_url:
            `${process.env.CLIENT_URL}/payment-cancelled?orderId=${order._id}`,
        });

      // --------------------------------------------------
      // Save Stripe session ID
      // --------------------------------------------------

      order.stripeSessionId = session.id;

      await order.save();

      return res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });

    } catch (error) {
      console.error(
        "Stripe Checkout Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to create Stripe checkout session.",
      });
    }
  }
);

module.exports = router;