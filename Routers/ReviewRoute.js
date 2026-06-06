const express = require("express");
const router = express.Router();
const {
    getProductReviews,
    createReview
} = require("../Controllers/ReviewController");
const { verifyToken } = require("../Utils/authMiddleware");

router.get("/:productId", getProductReviews);
router.post("/:productId", verifyToken, createReview);

module.exports = router;
