const express = require("express");
const router = express.Router();
const { requestPasswordReset } = require("../Controllers/PasswordResetController");

router.post("/", requestPasswordReset);

module.exports = router;
