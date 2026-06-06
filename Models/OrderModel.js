const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    email: { type: String, default: "" },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    date: { type: String, required: true },
    address: { type: String, default: "" },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", default: null },
    paymentStatus: { type: String, default: "Pending" },
    razorpayPaymentId: { type: String, default: "" },
    items: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            size: { type: String, default: "M" },
            color: { type: String, default: "Standard" }
        }
    ]
});

module.exports = mongoose.model("Order", OrderSchema);
