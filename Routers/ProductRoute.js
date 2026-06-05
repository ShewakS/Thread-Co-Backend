const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    updateProductStock,
    deleteProduct
} = require("../Controllers/ProductController");
const { verifyToken, isAdmin } = require("../Utils/authMiddleware");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", verifyToken, isAdmin, addProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.put("/:id/stock", verifyToken, isAdmin, updateProductStock);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
