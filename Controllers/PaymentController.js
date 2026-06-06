const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../Models/PaymentModel");

const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys are not configured.");
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = "INR", notes = {} } = req.body;
        const numericAmount = Number(amount);

        if (!numericAmount || numericAmount <= 0) {
            return res.status(400).json({ message: "A valid payment amount is required." });
        }

        const receipt = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const razorpay = getRazorpay();
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(numericAmount * 100),
            currency,
            receipt,
            notes
        });

        const payment = await Payment.create({
            receipt,
            userEmail: req.user.email,
            amount: numericAmount,
            currency,
            status: "created",
            method: "Razorpay",
            razorpayOrderId: razorpayOrder.id,
            notes
        });

        res.status(201).json({
            key: process.env.RAZORPAY_KEY_ID,
            paymentId: payment._id,
            order: razorpayOrder
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating payment order", error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { paymentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!paymentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Payment verification details are missing." });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            await Payment.findByIdAndUpdate(paymentId, {
                $set: {
                    status: "failed",
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                }
            });
            return res.status(400).json({ message: "Payment signature verification failed." });
        }

        const payment = await Payment.findOneAndUpdate(
            { _id: paymentId, userEmail: req.user.email },
            {
                $set: {
                    status: "captured",
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                }
            },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: "Payment record not found." });
        }

        res.status(200).json({ message: "Payment verified successfully", payment });
    } catch (error) {
        res.status(500).json({ message: "Error verifying payment", error: error.message });
    }
};

const getPayments = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { userEmail: req.user.email };
        const payments = await Payment.find(filter).sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching payments", error: error.message });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getPayments
};
