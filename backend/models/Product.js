
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ==========================================
    // PRODUCT BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // PRICE
    // ==========================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ==========================================
    // IMAGE
    // ==========================================

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // CATEGORY
    // ==========================================

    category: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // BRAND
    // ==========================================

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // SKIN TYPE
    // ==========================================

    skinType: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // STOCK
    // ==========================================

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================================
    // RATING
    // ==========================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // ==========================================
    // REVIEWS COUNT
    // ==========================================

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// PRODUCT MODEL
// ==========================================

const Product = mongoose.model(
  "Product",
  productSchema
);

module.exports = Product;

