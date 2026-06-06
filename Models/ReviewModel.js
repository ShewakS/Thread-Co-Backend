const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true, index: true },
        userEmail: { type: String, default: "", lowercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["Published", "Hidden"],
            default: "Published"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
