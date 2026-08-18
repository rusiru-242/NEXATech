const express = require("express");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Category = require("../models/Category");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ==========================================================
// HELPER
// Escape special regex characters
// ==========================================================

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================================
// ADMIN HOME
// ==========================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome to NexaTech Admin Panel",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

// ==========================================================
// ADMIN DASHBOARD
// ==========================================================

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();

      const totalUsers = await User.countDocuments({
        role: "customer",
      });

      const totalOrders = await Order.countDocuments();

      const revenueResult = await Order.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$total",
            },
          },
        },
      ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;

      return res.status(200).json({
        success: true,
        stats: {
          totalProducts,
          totalUsers,
          totalOrders,
          totalRevenue,
        },
      });
    } catch (error) {
      console.error("Dashboard data error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard data.",
      });
    }
  }
);

// ==========================================================
// GET ALL CATEGORIES
// GET /api/admin/categories
// ==========================================================

router.get(
  "/categories",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // ----------------------------------------------------
      // Categories saved through Admin panel
      // ----------------------------------------------------

      const savedCategories = await Category.find()
        .sort({
          name: 1,
        })
        .lean();

      // ----------------------------------------------------
      // Categories already used by products
      // ----------------------------------------------------

      const productCategories =
        await Product.distinct("category");

      // ----------------------------------------------------
      // Map categories
      // ----------------------------------------------------

      const categoryMap = new Map();

      // Add saved categories first
      savedCategories.forEach((category) => {
        if (
          category.name &&
          category.name.trim()
        ) {
          const cleanName =
            category.name.trim();

          categoryMap.set(
            cleanName.toLowerCase(),
            {
              _id: category._id,
              name: cleanName,
              productCount: 0,
              saved: true,
            }
          );
        }
      });

      // Add old/existing product categories
      productCategories.forEach(
        (categoryName) => {
          if (
            !categoryName ||
            !categoryName.trim()
          ) {
            return;
          }

          const cleanName =
            categoryName.trim();

          const key =
            cleanName.toLowerCase();

          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              _id: null,
              name: cleanName,
              productCount: 0,
              saved: false,
            });
          }
        }
      );

      // ----------------------------------------------------
      // Calculate product count
      // ----------------------------------------------------

      const categories =
        await Promise.all(
          Array.from(
            categoryMap.values()
          ).map(async (category) => {
            const productCount =
              await Product.countDocuments({
                category: {
                  $regex: `^${escapeRegex(
                    category.name
                  )}$`,
                  $options: "i",
                },
              });

            return {
              ...category,
              productCount,
            };
          })
        );

      // ----------------------------------------------------
      // Sort alphabetically
      // ----------------------------------------------------

      categories.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      return res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error(
        "Get categories error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch categories.",
      });
    }
  }
);

// ==========================================================
// CREATE CATEGORY
// POST /api/admin/categories
// ==========================================================

router.post(
  "/categories",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name } = req.body;

      // ----------------------------------------------------
      // Validation
      // ----------------------------------------------------

      if (
        !name ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Category name is required.",
        });
      }

      const categoryName =
        name.trim();

      const normalizedName =
        categoryName.toLowerCase();

      // ----------------------------------------------------
      // Check Category collection
      // ----------------------------------------------------

      const existingCategory =
        await Category.findOne({
          normalizedName,
        });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message:
            "Category already exists.",
        });
      }

      // ----------------------------------------------------
      // Check existing Product categories
      // ----------------------------------------------------

      const existingProduct =
        await Product.findOne({
          category: {
            $regex: `^${escapeRegex(
              categoryName
            )}$`,
            $options: "i",
          },
        });

      if (existingProduct) {
        return res.status(409).json({
          success: false,
          message:
            "Category already exists.",
        });
      }

      // ----------------------------------------------------
      // SAVE CATEGORY
      // ----------------------------------------------------

      const category =
        await Category.create({
          name: categoryName,
          normalizedName,
        });

      return res.status(201).json({
        success: true,
        message:
          "Category created successfully.",
        category: {
          _id: category._id,
          name: category.name,
          productCount: 0,
          saved: true,
        },
      });
    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      // MongoDB duplicate key
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "Category already exists.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to create category.",
      });
    }
  }
);

// ==========================================================
// DELETE CATEGORY
// DELETE /api/admin/categories/:name
// ==========================================================

router.delete(
  "/categories/:name",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const categoryName =
        decodeURIComponent(
          req.params.name
        ).trim();

      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message:
            "Category name is required.",
        });
      }

      // ----------------------------------------------------
      // Check products using category
      // ----------------------------------------------------

      const productCount =
        await Product.countDocuments({
          category: {
            $regex: `^${escapeRegex(
              categoryName
            )}$`,
            $options: "i",
          },
        });

      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Cannot delete a category that contains products.",
        });
      }

      // ----------------------------------------------------
      // Delete from Category collection
      // ----------------------------------------------------

      const category =
        await Category.findOneAndDelete({
          normalizedName:
            categoryName.toLowerCase(),
        });

      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Category deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete category.",
      });
    }
  }
);

// ==========================================================
// GET ALL CUSTOMERS
// ==========================================================

router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find({
        role: "customer",
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

      const customers =
        await Promise.all(
          users.map(async (user) => {
            const orderCount =
              await Order.countDocuments({
                user: user._id,
              });

            return {
              ...user.toObject(),
              orderCount,
            };
          })
        );

      return res.status(200).json({
        success: true,
        customers,
      });
    } catch (error) {
      console.error(
        "Get customers error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch customers.",
      });
    }
  }
);

// ==========================================================
// DELETE CUSTOMER
// ==========================================================

router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "Customer not found.",
        });
      }

      if (user.role === "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Admin account cannot be deleted.",
        });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "Customer deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete customer error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete customer.",
      });
    }
  }
);

// ==========================================================
// GET ALL REVIEWS
// ==========================================================

router.get(
  "/reviews",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const reviews =
        await Review.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "product",
            "name image"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error(
        "Get reviews error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch reviews.",
      });
    }
  }
);

// ==========================================================
// UPDATE REVIEW STATUS
// ==========================================================

router.put(
  "/reviews/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const allowedStatuses = [
        "pending",
        "approved",
        "hidden",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid review status.",
        });
      }

      const review =
        await Review.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        )
          .populate(
            "user",
            "name email"
          )
          .populate(
            "product",
            "name image"
          );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Review status updated successfully.",
        review,
      });
    } catch (error) {
      console.error(
        "Update review status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update review status.",
      });
    }
  }
);

// ==========================================================
// DELETE REVIEW
// ==========================================================

router.delete(
  "/reviews/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const review =
        await Review.findByIdAndDelete(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Review deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete review.",
      });
    }
  }
);

// ==========================================================
// ADMIN ORDERS
// ==========================================================

// GET ALL ORDERS

router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email phone"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error(
        "Get admin orders error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders.",
      });
    }
  }
);

// ==========================================================
// UPDATE ORDER STATUS
// ==========================================================

router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const allowedStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order status.",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      order.status = status;

      // Automatically mark payment as paid
      // for delivered card orders
      if (
        status === "delivered" &&
        order.paymentMethod === "card"
      ) {
        order.paymentStatus = "paid";
      }

      await order.save();

      const updatedOrder =
        await Order.findById(
          order._id
        ).populate(
          "user",
          "name email phone"
        );

      res.json({
        success: true,
        message:
          "Order status updated successfully.",
        order: updatedOrder,
      });
    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update order status.",
      });
    }
  }
);

// ==========================================================
// UPDATE PAYMENT STATUS
// ==========================================================

router.put(
  "/orders/:id/payment-status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { paymentStatus } =
        req.body;

      const allowedStatuses = [
        "pending",
        "paid",
        "failed",
      ];

      if (
        !allowedStatuses.includes(
          paymentStatus
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid payment status.",
        });
      }

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found.",
        });
      }

      order.paymentStatus =
        paymentStatus;

      await order.save();

      res.json({
        success: true,
        message:
          "Payment status updated successfully.",
        order,
      });
    } catch (error) {
      console.error(
        "Update payment status error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update payment status.",
      });
    }
  }
);

// ==========================================================
// ADMIN ANALYTICS
// ==========================================================

router.get(
  "/analytics",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const [
        totalOrders,
        totalUsers,
        totalProducts,
        revenueResult,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      ] = await Promise.all([
        Order.countDocuments(),

        User.countDocuments({
          role: "customer",
        }),

        Product.countDocuments(),

        Order.aggregate([
          {
            $match: {
              status: {
                $ne: "cancelled",
              },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$total",
              },
            },
          },
        ]),

        Order.countDocuments({
          status: "pending",
        }),

        Order.countDocuments({
          status: "processing",
        }),

        Order.countDocuments({
          status: "shipped",
        }),

        Order.countDocuments({
          status: "delivered",
        }),

        Order.countDocuments({
          status: "cancelled",
        }),
      ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0]
              .totalRevenue
          : 0;

      // ======================================================
      // BEST SELLING PRODUCTS
      // ======================================================

      const bestSellingProducts =
        await Order.aggregate([
          {
            $match: {
              status: {
                $ne: "cancelled",
              },
            },
          },
          {
            $unwind: "$items",
          },
          {
            $group: {
              _id: "$items.name",
              totalSold: {
                $sum: "$items.quantity",
              },
              revenue: {
                $sum: {
                  $multiply: [
                    "$items.price",
                    "$items.quantity",
                  ],
                },
              },
            },
          },
          {
            $sort: {
              totalSold: -1,
            },
          },
          {
            $limit: 5,
          },
        ]);

      // ======================================================
      // CATEGORY SALES
      // ======================================================

      const categorySales =
        await Order.aggregate([
          {
            $match: {
              status: {
                $ne: "cancelled",
              },
            },
          },
          {
            $unwind: "$items",
          },
          {
            $lookup: {
              from: "products",
              localField:
                "items.product",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          {
            $unwind: {
              path: "$productInfo",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: {
                $ifNull: [
                  "$productInfo.category",
                  "Other",
                ],
              },
              sales: {
                $sum: "$items.quantity",
              },
              revenue: {
                $sum: {
                  $multiply: [
                    "$items.price",
                    "$items.quantity",
                  ],
                },
              },
            },
          },
          {
            $sort: {
              revenue: -1,
            },
          },
        ]);

      // ======================================================
      // RECENT ORDERS
      // ======================================================

      const recentOrders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .select(
            "_id user total status paymentStatus createdAt"
          );

      res.json({
        success: true,

        overview: {
          totalOrders,
          totalUsers,
          totalProducts,
          totalRevenue,
        },

        orderStatus: {
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders,
        },

        bestSellingProducts,

        categorySales,

        recentOrders,
      });
    } catch (error) {
      console.error(
        "Admin analytics error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load analytics.",
      });
    }
  }
);

module.exports = router;