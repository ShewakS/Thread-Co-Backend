const express = require("express");
const router = express.Router();
const {
    getAllOffers,
    getOfferByCode,
    addOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus
} = require("../Controllers/OfferController");
const { verifyToken, isAdmin } = require("../Utils/authMiddleware");

router.get("/", getAllOffers);
router.get("/:code", getOfferByCode);
router.post("/", verifyToken, isAdmin, addOffer);
router.put("/:code", verifyToken, isAdmin, updateOffer);
router.put("/:code/toggle", verifyToken, isAdmin, toggleOfferStatus);
router.delete("/:code", verifyToken, isAdmin, deleteOffer);

module.exports = router;
