const express = require("express");

const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// REGISTER
// POST /api/auth/register
// ==============================
router.post("/register", registerUser);

// ==============================
// LOGIN
// POST /api/auth/login
// ==============================
router.post("/login", loginUser);

// ==============================
// GET CURRENT USER
// GET /api/auth/me
// ==============================
router.get("/me", authMiddleware, getMe);

// ==============================
// UPDATE PROFILE
// PUT /api/auth/profile
// ==============================
router.put("/profile", authMiddleware, updateProfile);

// ==============================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ==============================
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

// ==============================
// GET WISHLIST
// GET /api/auth/wishlist
// ==============================
router.get(
  "/wishlist",
  authMiddleware,
  getWishlist
);

// ==============================
// ADD TO WISHLIST
// POST /api/auth/wishlist/:productId
// ==============================
router.post(
  "/wishlist/:productId",
  authMiddleware,
  addToWishlist
);

// ==============================
// REMOVE FROM WISHLIST
// DELETE /api/auth/wishlist/:productId
// ==============================
router.delete(
  "/wishlist/:productId",
  authMiddleware,
  removeFromWishlist
);

module.exports = router;