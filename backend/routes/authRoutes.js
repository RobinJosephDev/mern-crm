const express = require("express");
const router = express.Router();

const { register, login, updateUser, deleteUser, requestPasswordReset, resetPassword } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Admin creates users
router.post("/register", protect, authorize("admin"), register);

// Auth
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

// Admin user management
router.put("/users/:id", protect, authorize("admin"), updateUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
