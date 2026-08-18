const express = require("express");

const Review = require("../models/Review");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================================
// CREATE REVIEW
// ==========================================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        product,
        rating,
        comment,
      } = req.body;

      if (!product || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message:
            "Product, rating and comment are required.",
        });
      }

      const productExists =
        await Product.findById(product);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const existingReview =
        await Review.findOne({
          user: req.user._id,
          product,
        });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message:
            "You have already reviewed this product.",
        });
      }

      const review = await Review.create({
        user: req.user._id,
        product,
        rating: Number(rating),
        comment: comment.trim(),
        status: "pending",
      });

      const populatedReview =
        await Review.findById(review._id)
          .populate("user", "name email")
          .populate("product", "name image");

      return res.status(201).json({
        success: true,
        message:
          "Review submitted successfully. Waiting for approval.",
        review: populatedReview,
      });
    } catch (error) {
      console.error(
        "Create review error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to submit review.",
      });
    }
  }
);


// ==========================================================
// GET PRODUCT REVIEWS
// ==========================================================

router.get(
  "/product/:productId",
  async (req, res) => {
    try {
      const reviews = await Review.find({
        product: req.params.productId,
        status: "approved",
      })
        .populate("user", "name")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error(
        "Get product reviews error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch reviews.",
      });
    }
  }
);


module.exports = router;