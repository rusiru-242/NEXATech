
const mongoose = require("mongoose");

// ==========================================================
// ORDER ITEM SCHEMA
// ==========================================================

const orderItemSchema = new mongoose.Schema(
  {
    // --------------------------------------------------------
    // PRODUCT REFERENCE
    // --------------------------------------------------------

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // --------------------------------------------------------
    // PRODUCT SNAPSHOT
    // --------------------------------------------------------
    // These values are copied when the order is created.
    // This prevents old orders from changing when the
    // product is edited later.

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    // --------------------------------------------------------
    // PRICE SNAPSHOT
    // --------------------------------------------------------

    // Final price paid by customer
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Original price before discount
    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Discount percentage at the time of purchase
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // --------------------------------------------------------
    // QUANTITY
    // --------------------------------------------------------

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

// ==========================================================
// ORDER SCHEMA
// ==========================================================

const orderSchema = new mongoose.Schema(
  {
    // ========================================================
    // CUSTOMER
    // ========================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ========================================================
    // ORDER ITEMS
    // ========================================================

    items: {
      type: [orderItemSchema],

      required: true,

      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length > 0,

        message:
          "Order must contain at least one item",
      },
    },

    // ========================================================
    // SHIPPING DETAILS
    // ========================================================

    shippingAddress: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // ========================================================
    // PAYMENT
    // ========================================================

    paymentMethod: {
      type: String,

      enum: [
        "cod",
        "card",
      ],

      default: "cod",
    },

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
      ],

      default: "pending",
    },

    // ========================================================
    // ORDER STATUS
    // ========================================================

    status: {
      type: String,

      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],

      default: "pending",
    },

    // ========================================================
    // STRIPE
    // ========================================================

    stripeSessionId: {
      type: String,
      default: null,
    },

    // ========================================================
    // PRICE
    // ========================================================

    subtotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    shippingFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

// ==========================================================
// MODEL
// ==========================================================

const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;

