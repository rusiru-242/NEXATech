const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const sendEmail = require("../utils/sendEmail");

// ==============================
// Generate JWT Token
// ==============================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==============================
// REGISTER USER
// ==============================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      role: "customer",
      wishlist: [],
    });

    // Generate token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating account",
    });
  }
};

// ==============================
// LOGIN USER
// ==============================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in",
    });
  }
};

// ==============================
// GET CURRENT USER
// GET /api/auth/me
// ==============================
const getMe = async (req, res) => {
  try {
    let user;

    try {
      user = await User.findById(req.user._id)
        .select("-password")
        .populate("wishlist");
    } catch (popErr) {
      console.warn("Populate wishlist failed, returning user without populated wishlist:", popErr.message);
      user = await User.findById(req.user._id).select("-password");
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// ==============================
// UPDATE PROFILE
// PUT /api/auth/profile
// ==============================
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    // Update email
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      if (!normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email cannot be empty",
        });
      }

      // Check if another user already has this email
      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "This email is already being used",
        });
      }

      user.email = normalizedEmail;
    }

    // Update phone (require exactly 10 digits when provided)
    if (phone !== undefined) {
      const phoneTrim = (phone || "").toString().trim();

      if (phoneTrim) {
        // Sri Lankan format: local 10-digit starting with 07 (07xxxxxxxx) or
        // international +94 followed by 9 digits starting with 7 (+947xxxxxxxx)
        const phoneRegex = /^(07\d{8}|\+947\d{8})$/;

        if (!phoneRegex.test(phoneTrim)) {
          return res.status(400).json({
            success: false,
            message:
              "Phone number is invalid. Use Sri Lankan format: 07XXXXXXXX or +947XXXXXXXX.",
          });
        }
      }

      user.phone = phoneTrim;
    }

    // Update address (require at least 5 characters when provided)
    if (address !== undefined) {
      const addressTrim = (address || "").toString().trim();

      if (addressTrim && addressTrim.length < 5) {
        return res.status(400).json({
          success: false,
          message: "Address must be at least 5 characters",
        });
      }

      user.address = addressTrim;
    }

    await user.save();

    let updatedUser;

    try {
      updatedUser = await User.findById(user._id)
        .select("-password")
        .populate("wishlist");
    } catch (popErr) {
      console.warn("Populate wishlist after update failed, returning user without populated wishlist:", popErr.message);
      updatedUser = await User.findById(user._id).select("-password");
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

// ==============================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// ==============================
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // Required fields
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    // Check new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Find user with password
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check current password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      newPassword,
      salt
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while changing password",
    });
  }
};

// ==============================
// ADD TO WISHLIST
// POST /api/auth/wishlist/:productId
// ==============================
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already in wishlist
    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product is already in your wishlist",
      });
    }

    user.wishlist.push(productId);

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("wishlist");

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding to wishlist",
    });
  }
};

// ==============================
// REMOVE FROM WISHLIST
// DELETE /api/auth/wishlist/:productId
// ==============================
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("wishlist");

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while removing from wishlist",
    });
  }
};

// ==============================
// GET WISHLIST
// GET /api/auth/wishlist
// ==============================
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching wishlist",
    });
  }
};

// (exports moved to end of file so functions are defined before exporting)

// ==============================
// SEND OTP (start registration)
// POST /api/auth/send-otp
// ==============================
const sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Do not allow if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    // Generate OTP and hashes
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert pending registration
    await PendingRegistration.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        otpHash,
        otpExpiresAt: expiresAt,
        lastSentAt: new Date(),
        otpAttempts: 0,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send email (or log in dev)
    const subject = "Your NexaTech verification code";
    const html = `<p>Your NexaTech verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`;

    const result = await sendEmail({ to: normalizedEmail, subject, html });

    if (result.devFallback) {
      return res.status(200).json({ success: true, message: "OTP generated and logged to server (dev fallback).", devFallback: true });
    }

    return res.status(200).json({ success: true, message: "OTP sent to email." });
  } catch (error) {
    console.error("sendOTP error:", error);
    return res.status(500).json({ success: false, message: "Server error while sending OTP" });
  }
};

// ==============================
// VERIFY OTP (complete registration)
// POST /api/auth/verify-otp
// ==============================
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pending = await PendingRegistration.findOne({ email: normalizedEmail });

    if (!pending) {
      return res.status(404).json({ success: false, message: "No pending registration found for this email" });
    }

    if (pending.otpExpiresAt < new Date()) {
      await PendingRegistration.deleteOne({ email: normalizedEmail });
      return res.status(410).json({ success: false, message: "OTP expired. Please register again." });
    }

    const match = await bcrypt.compare(otp, pending.otpHash);

    if (!match) {
      pending.otpAttempts = (pending.otpAttempts || 0) + 1;
      await pending.save();

      if (pending.otpAttempts >= 5) {
        await PendingRegistration.deleteOne({ email: normalizedEmail });
        return res.status(429).json({ success: false, message: "Too many failed attempts. Please re-register." });
      }

      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // Create the real user
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: "customer",
      wishlist: [],
    });

    // Remove pending registration
    await PendingRegistration.deleteOne({ email: normalizedEmail });

    const token = generateToken(user._id);

    return res.status(201).json({ success: true, message: "Account verified and created", token, user: { id: user._id, name: user.name, email: user.email, role: user.role, wishlist: user.wishlist } });
  } catch (error) {
    console.error("verifyOTP error:", error);
    return res.status(500).json({ success: false, message: "Server error while verifying OTP" });
  }
};

// ==============================
// RESEND OTP
// POST /api/auth/resend-otp
// ==============================
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pending = await PendingRegistration.findOne({ email: normalizedEmail });

    if (!pending) {
      return res.status(404).json({ success: false, message: "No pending registration found for this email" });
    }

    const now = new Date();
    if (pending.lastSentAt && now - pending.lastSentAt < 60 * 1000) {
      return res.status(429).json({ success: false, message: "Please wait before requesting another OTP" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pending.otpHash = otpHash;
    pending.otpExpiresAt = expiresAt;
    pending.lastSentAt = now;
    pending.otpAttempts = 0;

    await pending.save();

    const subject = "Your NexaTech verification code (resend)";
    const html = `<p>Your NexaTech verification code is: <strong>${otp}</strong></p><p>This code expires in 10 minutes.</p>`;

    const result = await sendEmail({ to: normalizedEmail, subject, html });

    if (result.devFallback) {
      return res.status(200).json({ success: true, message: "OTP resent and logged to server (dev fallback).", devFallback: true });
    }

    return res.status(200).json({ success: true, message: "OTP resent to email." });
  } catch (error) {
    console.error("resendOTP error:", error);
    return res.status(500).json({ success: false, message: "Server error while resending OTP" });
  }
};

  // ==============================
  // EXPORT
  // ==============================
  module.exports = {
    sendOTP,
    verifyOTP,
    resendOTP,
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    changePassword,
    addToWishlist,
    removeFromWishlist,
    getWishlist,
  };