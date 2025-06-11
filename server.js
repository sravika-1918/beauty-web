require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Define Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    categories: [String]  // Must be an array
});

const Product = mongoose.model("Product", productSchema);

// API to Get Products by Category
app.get("/products", async (req, res) => {
    try {
        const category = req.query.category;  // Get category from query param
        if (!category) {
            return res.status(400).json({ error: "Category is required" });
        }

        console.log("🔍 Searching for products in category:", category);
        const products = await Product.find({ categories: { $in: [category] } });

        console.log("✅ Products found:", products);
        res.json(products);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
