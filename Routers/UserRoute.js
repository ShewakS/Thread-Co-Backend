const express = require("express");
const router = express.Router();
const {
    signupUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    syncUserCartAndWishlist,
    deleteUser
} = require("../Controllers/UserController");
const { verifyToken, isAdmin } = require("../Utils/authMiddleware");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/list", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.put("/profile", verifyToken, updateUserProfile);
router.put("/sync", verifyToken, syncUserCartAndWishlist);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;