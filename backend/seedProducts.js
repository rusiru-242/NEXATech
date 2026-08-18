const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const products = require("./data/products.json");

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    // Remove existing products
    await Product.deleteMany({});

    console.log("Existing products removed.");

    // Insert sample products
    const createdProducts = await Product.insertMany(
      products
    );

    console.log(
      `${createdProducts.length} sample products added successfully.`
    );

    // Close connection
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");

    process.exit(0);
  } catch (error) {
    console.error(
      "Product seeding error:",
      error
    );

    process.exit(1);
  }
};

seedProducts();