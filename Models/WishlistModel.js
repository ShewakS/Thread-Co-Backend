const mongoose = require("mongoose");

const WishlistItemSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, default: "" },
        price: { type: Number, default: 0 },
        image: { type: String, default: "" },
        rating: { type: Number, default: 0 }
    },
    { _id: false }
);

const WishlistSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
        items: { type: [WishlistItemSchema], default: [] }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
