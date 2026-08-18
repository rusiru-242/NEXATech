const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    // ==========================================
    // Connect to MongoDB using existing db.js
    // ==========================================
    const connected = await connectDB({
      retries: 5,
      delayMS: 3000,
    });

    if (!connected) {
      console.error("❌ Could not connect to MongoDB.");
      process.exit(1);
    }

    console.log("MongoDB connected for admin creation.");

    // ==========================================
    // Admin Details
    // ==========================================

    const adminName = "NexaTech Admin";
    const adminEmail = "admin@nexatech.com";
    const adminPassword = "Admin@12345";

    // ==========================================
    // Check Existing Admin
    // ==========================================

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("\n=================================");
      console.log("Admin account already exists");
      console.log("=================================");
      console.log(`Name  : ${existingAdmin.name}`);
      console.log(`Email : ${existingAdmin.email}`);
      console.log(`Role  : ${existingAdmin.role}`);
      console.log("=================================\n");

      await mongoose.connection.close();

      process.exit(0);
    }

    // ==========================================
    // Hash Password
    // ==========================================

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    // ==========================================
    // Create Admin
    // ==========================================

    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      phone: "",
      address: "",
      wishlist: [],
    });

    // ==========================================
    // Success
    // ==========================================

    console.log("\n=================================");
    console.log("✅ Admin account created successfully");
    console.log("=================================");
    console.log(`Name     : ${admin.name}`);
    console.log(`Email    : ${admin.email}`);
    console.log(`Role     : ${admin.role}`);
    console.log(`Password : ${adminPassword}`);
    console.log("=================================\n");

    await mongoose.connection.close();

    console.log("MongoDB connection closed.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Create admin error:", error);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore connection close error
    }

    process.exit(1);
  }
};

createAdmin();