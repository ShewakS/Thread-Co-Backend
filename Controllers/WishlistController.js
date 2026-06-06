const User = require("../Models/UserModel");
const Wishlist = require("../Models/WishlistModel");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const syncUserWishlist = async (email, items) => {
    await User.findOneAndUpdate({ email }, { $set: { wishlist: items } });
};

const getWishlist = async (req, res) => {
    try {
        const email = normalizeEmail(req.user.email);
        let wishlist = await Wishlist.findOne({ userEmail: email });

        if (!wishlist) {
            const user = await User.findOne({ email });
            wishlist = await Wishlist.create({ userEmail: email, items: user?.wishlist || [] });
        }

        res.status(200).json(wishlist.items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching wishlist", error: error.message });
    }
};

const replaceWishlist = async (req, res) => {
    try {
        const email = normalizeEmail(req.user.email);
        const items = Array.isArray(req.body.items) ? req.body.items : [];

        const wishlist = await Wishlist.findOneAndUpdate(
            { userEmail: email },
            { $set: { items } },
            { new: true, upsert: true }
        );
        await syncUserWishlist(email, wishlist.items);

        res.status(200).json(wishlist.items);
    } catch (error) {
        res.status(500).json({ message: "Error saving wishlist", error: error.message });
    }
};

const addWishlistItem = async (req, res) => {
    try {
        const email = normalizeEmail(req.user.email);
        const item = req.body;

        if (!item?.id || !item?.name) {
            return res.status(400).json({ message: "Wishlist item id and name are required." });
        }

        const wishlist = await Wishlist.findOneAndUpdate(
            { userEmail: email, "items.id": { $ne: String(item.id) } },
            { $push: { items: item } },
            { new: true, upsert: true }
        );
        const latest = wishlist || await Wishlist.findOne({ userEmail: email });
        await syncUserWishlist(email, latest.items);

        res.status(200).json(latest.items);
    } catch (error) {
        res.status(500).json({ message: "Error adding wishlist item", error: error.message });
    }
};

const removeWishlistItem = async (req, res) => {
    try {
        const email = normalizeEmail(req.user.email);
        const wishlist = await Wishlist.findOneAndUpdate(
            { userEmail: email },
            { $pull: { items: { id: String(req.params.productId) } } },
            { new: true, upsert: true }
        );
        await syncUserWishlist(email, wishlist.items);

        res.status(200).json(wishlist.items);
    } catch (error) {
        res.status(500).json({ message: "Error removing wishlist item", error: error.message });
    }
};

module.exports = {
    getWishlist,
    replaceWishlist,
    addWishlistItem,
    removeWishlistItem
};
