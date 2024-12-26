const express = require("express");
const router = express.Router();
const { updatePassword } = require("../controllers/userController");

// POST route to update password
router.post("/update-password/:id", updatePassword);

module.exports = router;
