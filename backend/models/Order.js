const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

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

const orderSchema = new mongoose.Schema(
  {
    // ==============================
    // CUSTOMER
    // ==============================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==============================
    // ORDER ITEMS
    // ==============================
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    // ==============================
    // SHIPPING DETAILS
    // ==============================
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

    // ==============================
    // PAYMENT
    // ==============================
    paymentMethod: {
      type: String,
      enum: ["cod", "card"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // ==============================
    // ORDER STATUS
    // ==============================
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

    // ==============================
    // PRICE
    // ==============================
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

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;