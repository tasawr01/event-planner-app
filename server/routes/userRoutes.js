const express = require("express");
const router = express.Router();
const { updatePassword } = require("../controllers/userController");

router.post("/update-password/:id", updatePassword);

module.exports = router;
