const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
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
// =====================================================
router.post("/", async (req, res) => {
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
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are required.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      category,
      brand,
      skinType,
      stock,
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
});

// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================================
router.put("/:id", async (req, res) => {
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
});

// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================
router.delete("/:id", async (req, res) => {
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
});

module.exports = router;