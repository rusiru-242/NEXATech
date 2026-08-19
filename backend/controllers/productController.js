const Product = require("../models/Product");

// =========================================================
// GET ALL PRODUCTS
// =========================================================
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        console.error("Get Products Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =========================================================
// GET SINGLE PRODUCT
// =========================================================
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        res.status(200).json({ product });
    } catch (error) {
        console.error("Get Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =========================================================
// CREATE PRODUCT (Admin)
// =========================================================
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            brand,
            stock,
            image,
            discount,
        } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: "Name, price and category are required.",
            });
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            brand,
            stock: Number(stock || 0),
            image,
            discount: Number(discount || 0),
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product,
        });
    } catch (error) {
        console.error("Create Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =========================================================
// UPDATE PRODUCT (Admin)
// =========================================================
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        Object.assign(product, req.body);

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product,
        });
    } catch (error) {
        console.error("Update Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =========================================================
// DELETE PRODUCT (Admin)
// =========================================================
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Product Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};