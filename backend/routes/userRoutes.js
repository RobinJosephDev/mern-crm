const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// GET ALL USERS (Admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
});

// GET employees only
router.get("/employees", protect, async (req, res) => {
  try {
    const employees = await User.find({
      role: "employee",
      isActive: true,
    }).select("_id name email");

    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Failed to load employees" });
  }
});

// GET carriers only
router.get("/carriers", protect, async (req, res) => {
  try {
    const carriers = await User.find({
      role: "carrier",
      isActive: true,
    }).select("_id name email");

    res.json(carriers);
  } catch (err) {
    res.status(500).json({ message: "Failed to load carriers" });
  }
});

module.exports = router;
