const express = require("express");
const router = express.Router();
const {
    getWishlist,
    replaceWishlist,
    addWishlistItem,
    removeWishlistItem
} = require("../Controllers/WishlistController");
const { verifyToken } = require("../Utils/authMiddleware");

router.get("/", verifyToken, getWishlist);
router.put("/", verifyToken, replaceWishlist);
router.post("/", verifyToken, addWishlistItem);
router.delete("/:productId", verifyToken, removeWishlistItem);

module.exports = router;
