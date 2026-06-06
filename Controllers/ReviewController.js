const Review = require("../Models/ReviewModel");

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            productId: String(req.params.productId),
            status: "Published"
        }).sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

const createReview = async (req, res) => {
    try {
        const { name, rating, text } = req.body;
        const numericRating = Number(rating);

        if (!name || !text || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: "Name, rating, and review text are required." });
        }

        const review = await Review.create({
            productId: String(req.params.productId),
            userEmail: req.user?.email || "",
            name,
            rating: numericRating,
            text
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Error saving review", error: error.message });
    }
};

module.exports = {
    getProductReviews,
    createReview
};
