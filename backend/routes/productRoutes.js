const express = require("express");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// Public
// =====================================================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
});

// =====================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// Public
// =====================================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
});

// =====================================================
// CREATE PRODUCT
// POST /api/products
// Admin Only
// =====================================================
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        image,
        category,
        brand,
        skinType,
        stock,
        rating,
        reviews,
        discount,
      } = req.body;

      // -----------------------------------------------
      // Validation
      // -----------------------------------------------

      if (!name || price === undefined || !category || !brand) {
        return res.status(400).json({
          success: false,
          message:
            "Product name, price, category and brand are required.",
        });
      }

      // -----------------------------------------------
      // Create Product
      // -----------------------------------------------

      const product = await Product.create({
        name: name.trim(),
        description: description || "",
        price: Number(price),
        image: image || "",
        category: category.trim(),
        brand: brand.trim(),
        skinType: skinType || "All",
        stock: Number(stock) || 0,
        rating: Number(rating) || 0,
        reviews: Number(reviews) || 0,
        discount: Number(discount) || 0,
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create product.",
      });
    }
  }
);

// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// Admin Only
// =====================================================
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update product.",
      });
    }
  }
);

// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// Admin Only
// =====================================================
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      const product =
        await Product.findByIdAndDelete(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete product.",
      });
    }
  }
);

module.exports = router;