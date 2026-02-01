const FollowUp = require("../models/FollowUp");

// CREATE FollowUp
exports.createFollowUp = async (req, res) => {
  try {
    if (!req.body.leadNumber || !req.body.phone || !req.body.email) {
      return res.status(400).json({
        message: "Lead number, phone and email are required",
      });
    }

    const existingLead = await FollowUp.findOne({
      leadNumber: req.body.leadNumber,
    });

    if (existingLead) {
      return res.status(400).json({ message: "Lead number already exists" });
    }

    const lead = await FollowUp.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL FollowUp
// GET ALL FollowUp (role-based)
exports.getFollowUp = async (req, res) => {
  try {
    let filter = {};

    // If logged-in user is EMPLOYEE → only their assigned leads
    if (req.user.role === "employee") {
      filter.assignedTo = req.user.id;
    }

    const leads = await FollowUp.find(filter).populate("assignedTo", "name email").populate("createdBy", "name email").sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE FollowUp BY ID
exports.getFollowUpById = async (req, res) => {
  try {
    const lead = await FollowUp.findById(req.params.id).populate("assignedTo", "name email role").populate("createdBy", "name email role");

    if (!lead) {
      return res.status(404).json({ message: "FollowUp not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LEAD
// UPDATE LEAD
exports.updateFollowUp = async (req, res) => {
  try {
    const updatedFollowUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!updatedFollowUp) {
      return res.status(404).json({ message: "FollowUp not found" });
    }

    res.json(updatedFollowUp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LEAD
exports.deleteFollowUp = async (req, res) => {
  try {
    const lead = await FollowUp.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "FollowUp not found" });
    }

    await lead.deleteOne();

    res.json({ message: "FollowUp deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
