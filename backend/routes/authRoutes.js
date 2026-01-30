const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Admin creates users
router.post("/register", protect, authorize("admin"), register);

// Login remains public
router.post("/login", login);

module.exports = router;
