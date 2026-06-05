const Offer = require("../Models/OfferModel");

const getAllOffers = async (req, res) => {
    try {
        const { active } = req.query;
        const filter = {};
        if (active !== undefined) filter.active = active === 'true';
        
        const offers = await Offer.find(filter).sort({ _id: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching offers", error: error.message });
    }
};

const getOfferByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const offer = await Offer.findOne({ code: String(code).toUpperCase() });
        if (!offer) {
            return res.status(404).json({ message: "Offer not found." });
        }
        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching offer", error: error.message });
    }
};

const addOffer = async (req, res) => {
    try {
        const { code, discount, startDate, endDate } = req.body;
        
        if (!code || discount === undefined || !startDate || !endDate) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        
        const normalizedCode = String(code).trim().toUpperCase();
        
        const existingOffer = await Offer.findOne({ code: normalizedCode });
        if (existingOffer) {
            return res.status(400).json({ message: "Offer code already exists." });
        }
        
        const newOffer = new Offer({
            code: normalizedCode,
            discount: Number(discount),
            startDate,
            endDate,
            active: true,
            status: "Active"
        });
        
        const savedOffer = await newOffer.save();
        res.status(201).json(savedOffer);
    } catch (error) {
        res.status(500).json({ message: "Error adding offer", error: error.message });
    }
};

const updateOffer = async (req, res) => {
    try {
        const { code } = req.params;
        const { discount, startDate, endDate } = req.body;
        
        const normalizedCode = String(code).toUpperCase();
        const offer = await Offer.findOne({ code: normalizedCode });
        
        if (!offer) {
            return res.status(404).json({ message: "Offer not found." });
        }
        
        if (discount !== undefined) offer.discount = Number(discount);
        if (startDate) offer.startDate = startDate;
        if (endDate) offer.endDate = endDate;
        
        const updatedOffer = await offer.save();
        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(500).json({ message: "Error updating offer", error: error.message });
    }
};

const deleteOffer = async (req, res) => {
    try {
        const { code } = req.params;
        const result = await Offer.findOneAndDelete({ code: String(code).toUpperCase() });
        if (!result) {
            return res.status(404).json({ message: "Offer not found." });
        }
        res.status(200).json({ message: "Offer deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting offer", error: error.message });
    }
};

const toggleOfferStatus = async (req, res) => {
    try {
        const { code } = req.params;
        const normalizedCode = String(code).toUpperCase();
        
        const offer = await Offer.findOne({ code: normalizedCode });
        if (!offer) {
            return res.status(404).json({ message: "Offer not found." });
        }
        
        offer.status = offer.status === "Active" ? "Inactive" : "Active";
        offer.active = offer.status === "Active";
        
        const updatedOffer = await offer.save();
        res.status(200).json(updatedOffer);
    } catch (error) {
        res.status(500).json({ message: "Error toggling offer status", error: error.message });
    }
};

module.exports = {
    getAllOffers,
    getOfferByCode,
    addOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus
};
