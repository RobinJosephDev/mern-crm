const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET employees only
router.get("/employees", async (req, res) => {
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

module.exports = router;
