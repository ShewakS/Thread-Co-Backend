const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    active: { type: Boolean, default: true },
    status: { type: String, default: "Active" }
});

module.exports = mongoose.model("Offer", OfferSchema);
