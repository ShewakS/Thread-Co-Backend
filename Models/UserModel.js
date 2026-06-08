const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, default: "customer" },
    acceptedPolicies: { type: Boolean, default: false },
    acceptedPoliciesAt: { type: Date, default: null },
    addresses: { type: [String], default: [] },
    cart: { type: Array, default: [] },
    wishlist: { type: Array, default: [] }
});

module.exports = mongoose.model("User", UserSchema);
