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

// =========================================================
// SEARCH PRODUCTS (For AI shopping assistant & product search)
// GET /api/products/search
// =========================================================
const searchProducts = async (req, res) => {
    try {
        const {
            keyword,
            category,
            brand,
            minPrice,
            maxPrice,
            inStock,
            limit = 20,
        } = req.query;

        const query = {};

        // Keyword search across name, description, brand, category
        if (keyword && keyword.trim()) {
            const cleanKeyword = keyword.trim();
            query.$or = [
                { name: { $regex: cleanKeyword, $options: "i" } },
                { description: { $regex: cleanKeyword, $options: "i" } },
                { brand: { $regex: cleanKeyword, $options: "i" } },
                { category: { $regex: cleanKeyword, $options: "i" } },
            ];
        }

        // Category filter (flexible case-insensitive regex e.g. "laptop" matches "Laptops")
        if (category && category.trim()) {
            query.category = { $regex: category.trim(), $options: "i" };
        }

        // Brand filter
        if (brand && brand.trim()) {
            query.brand = { $regex: brand.trim(), $options: "i" };
        }

        // Price range filter
        if ((minPrice !== undefined && minPrice !== "") || (maxPrice !== undefined && maxPrice !== "")) {
            query.price = {};
            if (minPrice !== undefined && minPrice !== "") {
                const min = Number(minPrice);
                if (!isNaN(min)) query.price.$gte = min;
            }
            if (maxPrice !== undefined && maxPrice !== "") {
                const max = Number(maxPrice);
                if (!isNaN(max)) query.price.$lte = max;
            }
            if (Object.keys(query.price).length === 0) {
                delete query.price;
            }
        }

        // In Stock filter
        if (inStock === "true" || inStock === true) {
            query.stock = { $gt: 0 };
        }

        const maxLimit = Math.min(Number(limit) || 20, 50);

        const products = await Product.find(query)
            .sort({ rating: -1, stock: -1, createdAt: -1 })
            .limit(maxLimit);

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error("Search Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search products.",
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
};