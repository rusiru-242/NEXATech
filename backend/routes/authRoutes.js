const express = require("express");

const {
  registerUser,
  sendOTP,
  verifyOTP,
  resendOTP,
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
// OTP Registration
// POST /api/auth/send-otp
// POST /api/auth/verify-otp
// POST /api/auth/resend-otp
// ==============================
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

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