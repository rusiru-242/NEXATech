const express = require("express");
const Stripe = require("stripe");

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/*
==================================================
CREATE STRIPE CHECKOUT SESSION
POST /api/payments/create-checkout-session
==================================================
*/
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

      if (order.paymentStatus === "paid") {
        return res.status(400).json({
          success: false,
          message: "This order has already been paid.",
        });
      }

      /*
      ------------------------------------------
      Create Stripe line items
      ------------------------------------------
      */

      const lineItems = order.items.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.name,
          },

          unit_amount: Math.round(
            Number(item.price) * 100
          ),
        },

        quantity: Number(item.quantity),
      }));

      /*
      ------------------------------------------
      Add shipping fee
      ------------------------------------------
      */

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

      /*
      ------------------------------------------
      Create Stripe Checkout Session
      ------------------------------------------
      */

      const session =
        await stripe.checkout.sessions.create({
          mode: "payment",

          payment_method_types: ["card"],

          customer_email: req.user.email,

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

      /*
      ------------------------------------------
      Save Stripe Session ID
      ------------------------------------------
      */

      order.stripeSessionId = session.id;

      await order.save();

      console.log(
        `Stripe Checkout Session created: ${session.id}`
      );

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

/*
==================================================
STRIPE WEBHOOK
POST /api/payments/webhook
==================================================

IMPORTANT:
The raw body is already handled in server.js:

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

Therefore DO NOT use express.raw() here again.
==================================================
*/

router.post(
  "/webhook",
  async (req, res) => {
    const signature =
      req.headers["stripe-signature"];

    let event;

    /*
    ------------------------------------------
    Verify Stripe Webhook Signature
    ------------------------------------------
    */

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error(
        "Stripe Webhook Signature Error:",
        error.message
      );

      return res.status(400).send(
        `Webhook Error: ${error.message}`
      );
    }

    /*
    ------------------------------------------
    Process Stripe Event
    ------------------------------------------
    */

    try {
      /*
      ==========================================
      CHECKOUT SESSION COMPLETED
      ==========================================
      */

      if (
        event.type ===
        "checkout.session.completed"
      ) {
        const session = event.data.object;

        const orderId =
          session.metadata?.orderId;

        if (!orderId) {
          console.error(
            "Webhook Error: Order ID missing from Stripe metadata."
          );

          return res.status(400).json({
            success: false,
            message: "Order ID missing.",
          });
        }

        /*
        ------------------------------------------
        Find Order
        ------------------------------------------
        */

        const order =
          await Order.findById(orderId);

        if (!order) {
          console.error(
            `Webhook Error: Order ${orderId} not found.`
          );

          return res.status(404).json({
            success: false,
            message: "Order not found.",
          });
        }

        /*
        ------------------------------------------
        Update Payment Status
        ------------------------------------------
        */

        order.paymentStatus = "paid";

        order.stripeSessionId =
          session.id;

        /*
        ------------------------------------------
        Update Order Status
        ------------------------------------------
        */

        if (order.status === "pending") {
          order.status = "processing";
        }

        await order.save();

        console.log(
          "=========================================="
        );

        console.log(
          "STRIPE PAYMENT SUCCESS"
        );

        console.log(
          `Order ID: ${orderId}`
        );

        console.log(
          "Payment Status: paid"
        );

        console.log(
          "Order Status: processing"
        );

        console.log(
          "=========================================="
        );
      }

      /*
      ==========================================
      CHECKOUT SESSION EXPIRED
      ==========================================
      */

      if (
        event.type ===
        "checkout.session.expired"
      ) {
        const session = event.data.object;

        const orderId =
          session.metadata?.orderId;

        if (orderId) {
          await Order.findByIdAndUpdate(
            orderId,
            {
              paymentStatus: "failed",
            }
          );

          console.log(
            `Stripe session expired. Order ${orderId} marked as FAILED.`
          );
        }
      }

      /*
      ------------------------------------------
      Tell Stripe webhook was received
      ------------------------------------------
      */

      return res.status(200).json({
        received: true,
      });
    } catch (error) {
      console.error(
        "Stripe Webhook Processing Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Webhook processing failed.",
      });
    }
  }
);

module.exports = router;