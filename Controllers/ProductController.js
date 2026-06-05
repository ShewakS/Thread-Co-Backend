const Product = require("../Models/ProductModel");

const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = await Product.find(filter);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, category, price, image, rating, stock } = req.body;
        
        if (!name || !category || !price || !image) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        
        const id = `p-${Date.now()}`;
        const newProduct = new Product({
            id,
            name,
            category,
            price: Number(price),
            image,
            rating: rating || 4.0,
            stock: stock || { S: 10, M: 15, L: 8, XL: 5 }
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, image, rating } = req.body;
        
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        
        if (name) product.name = name;
        if (category) product.category = category;
        if (price) product.price = Number(price);
        if (image) product.image = image;
        if (rating !== undefined) product.rating = Number(rating);
        
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

const updateProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { size, value } = req.body;
        
        const product = await Product.findOne({ id });
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        
        if (!product.stock) {
            product.stock = { S: 10, M: 15, L: 8, XL: 5 };
        }
        product.stock[size] = Math.max(0, Number(value));
        
        product.markModified('stock');
        const updatedProduct = await product.save();
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating stock", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    updateProductStock,
    deleteProduct
};
