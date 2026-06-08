const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, lowercase: true, trim: true },
        status: { type: String, default: "Requested" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
