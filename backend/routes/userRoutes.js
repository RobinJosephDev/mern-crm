const express = require("express");
const router = express.Router();
const User = require("../models/User");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// ================= GET ALL USERS (Admin) =================
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to load users" });
  }
});

// ================= GET EMPLOYEES =================
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

// ================= GET CARRIERS =================
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

// ================= UPDATE USER (Admin) =================
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const allowedFields = ["name", "email", "role", "companyName", "phone", "isActive"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// ================= DELETE USER (Admin) =================
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
