const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    placeOrder,
    updateOrderStatus,
    deleteOrder
} = require("../Controllers/OrderController");
const { verifyToken, isAdmin } = require("../Utils/authMiddleware");

router.get("/", verifyToken, getAllOrders);
router.get("/:id", verifyToken, getOrderById);
router.post("/", verifyToken, placeOrder);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.delete("/:id", verifyToken, isAdmin, deleteOrder);

module.exports = router;
