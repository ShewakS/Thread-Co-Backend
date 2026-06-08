const ContactMessage = require("../Models/ContactMessageModel");

const createContactMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All contact fields are required." });
        }

        const savedMessage = await ContactMessage.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({ message: "Message saved successfully.", data: savedMessage });
    } catch (error) {
        res.status(500).json({ message: "Error saving contact message", error: error.message });
    }
};

module.exports = { createContactMessage };
