const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    stock: {
        S: { type: Number, default: 10 },
        M: { type: Number, default: 15 },
        L: { type: Number, default: 8 },
        XL: { type: Number, default: 5 }
    }
});

module.exports = mongoose.model("Product", ProductSchema);
