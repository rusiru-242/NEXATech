const mongoose = require("mongoose");
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
        const { id } = req.params;
        let targetId = id;
        const HISTORICAL_ALIASES = {
            "6aa5781284ca26f1210c460e": "6a847ef0d2a7ee4b68a3e8f7", // Samsung Galaxy S24 Ultra
            "6aa5781284ca26f1210c460d": "6a847ef0d2a7ee4b68a3e8f6", // iPhone 15 Pro
            "6aa5781284ca26f1210c460f": "6a847ef0d2a7ee4b68a3e8fb", // Samsung Galaxy A55
            "6aa5781284ca26f1210c4610": "6a847ef0d2a7ee4b68a3e8fa", // Xiaomi 14
            "6aa5764184ca26f1210c45b7": "6a847ef0d2a7ee4b68a3e8f1", // MacBook Air M3
            "6aa5764184ca26f1210c45b8": "6a847ef0d2a7ee4b68a3e8ee", // ASUS ROG Strix G16
            "6aa5764184ca26f1210c45b9": "6a847ef0d2a7ee4b68a3e8f2", // Dell XPS 15
            "6aa5764184ca26f1210c45ba": "6a847ef0d2a7ee4b68a3e8ef", // Lenovo Legion 5
            "6a9ee445128bbceca0411336": "6a847ef0d2a7ee4b68a3e8f0", // HP Victus 16
            "6a9ee445128bbceca0411337": "6a847ef0d2a7ee4b68a3e8f3", // Acer Nitro V15
            "6aa0dae85bab676165a259b9": "6a847ef0d2a7ee4b68a3e906", // Apple AirPods Pro 2
            "6aa0dae85bab676165a259ba": "6a847ef0d2a7ee4b68a3e909", // Sennheiser Momentum 4
            "6aa0dae85bab676165a259bb": "6a847ef0d2a7ee4b68a3e907", // JBL Charge 5
            "6aa0dae85bab676165a259bc": "6a847ef0d2a7ee4b68a3e90a", // Anker Soundcore Motion+
            "6aa0db925bab676165a259d9": "6a847ef0d2a7ee4b68a3e8f6", // iPhone 15 Pro
            "6aa0db925bab676165a259da": "6a847ef0d2a7ee4b68a3e8f7", // Samsung Galaxy S24 Ultra
            "6aa0db925bab676165a259db": "6a847ef0d2a7ee4b68a3e8fb", // Samsung Galaxy A55
            "6aa0db925bab676165a259dc": "6a847ef0d2a7ee4b68a3e8fa", // Xiaomi 14
            "6aa2e1984aa5a2493ad642bd": "6a847ef0d2a7ee4b68a3e8f0", // HP Victus 16
            "6aa2e1984aa5a2493ad642be": "6a847ef0d2a7ee4b68a3e8f3", // Acer Nitro V15
        };

        if (HISTORICAL_ALIASES[id]) {
            targetId = HISTORICAL_ALIASES[id];
        }

        let product = null;

        if (mongoose.Types.ObjectId.isValid(targetId)) {
            product = await Product.findById(targetId);
        }

        // Fallback: If not found by direct ID, check if this ID belongs to an AI chat message product
        if (!product && mongoose.Types.ObjectId.isValid(id)) {
            try {
                const AIChat = require("../models/AIChat");
                const chatWithProd = await AIChat.findOne(
                    {
                        $or: [
                            { "messages.products._id": id },
                            { "messages.products.productId": id },
                        ],
                    },
                    { "messages.products.$": 1 }
                );

                if (chatWithProd && chatWithProd.messages?.[0]?.products?.length > 0) {
                    const matchedSub = chatWithProd.messages[0].products.find(
                        (p) => String(p._id) === String(id) || String(p.productId) === String(id)
                    ) || chatWithProd.messages[0].products[0];

                    if (matchedSub?.productId && mongoose.Types.ObjectId.isValid(matchedSub.productId)) {
                        product = await Product.findById(matchedSub.productId);
                    }
                    if (!product && matchedSub?.name) {
                        product = await Product.findOne({
                            name: { $regex: `^${matchedSub.name.trim()}$`, $options: "i" },
                        });
                    }
                }
            } catch (fallbackErr) {
                console.warn("AI Chat subdocument product lookup fallback error:", fallbackErr);
            }
        }

        // Fallback: Search by clean name if id looks like a product name/slug
        if (!product && typeof id === "string" && id.trim().length > 1) {
            try {
                const cleanName = decodeURIComponent(id).replace(/[-_]/g, " ").trim();
                product = await Product.findOne({
                    name: { $regex: cleanName, $options: "i" },
                });
            } catch (nameErr) {
                // Ignore decoding error
            }
        }

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