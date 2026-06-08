const PasswordReset = require("../Models/PasswordResetModel");

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const resetRequest = await PasswordReset.create({ email });
        res.status(201).json({
            message: "Password reset request saved successfully.",
            data: resetRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Error saving password reset request", error: error.message });
    }
};

module.exports = { requestPasswordReset };
