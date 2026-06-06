const express = require("express");
const router = express.Router();
const {
    createPaymentOrder,
    verifyPayment,
    getPayments
} = require("../Controllers/PaymentController");
const { verifyToken } = require("../Utils/authMiddleware");

router.get("/", verifyToken, getPayments);
router.post("/create-order", verifyToken, createPaymentOrder);
router.post("/verify", verifyToken, verifyPayment);

module.exports = router;
