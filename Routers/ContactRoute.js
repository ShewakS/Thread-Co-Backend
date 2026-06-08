const express = require("express");
const router = express.Router();
const { createContactMessage } = require("../Controllers/ContactController");

router.post("/", createContactMessage);

module.exports = router;
