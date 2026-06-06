const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        receipt: { type: String, required: true, unique: true },
        orderId: { type: String, default: "" },
        userEmail: { type: String, required: true, lowercase: true, trim: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        status: {
            type: String,
            enum: ["created", "authorized", "captured", "failed", "cod"],
            default: "created"
        },
        method: { type: String, default: "Razorpay" },
        razorpayOrderId: { type: String, default: "" },
        razorpayPaymentId: { type: String, default: "" },
        razorpaySignature: { type: String, default: "" },
        notes: { type: Object, default: {} }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
