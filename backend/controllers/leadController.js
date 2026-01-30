const Lead = require("../models/Lead");

// CREATE LEAD
exports.createLead = async (req, res) => {
  try {
    if (!req.body.leadNumber || !req.body.phone || !req.body.email) {
      return res.status(400).json({
        message: "Lead number, phone and email are required",
      });
    }

    const existingLead = await Lead.findOne({
      leadNumber: req.body.leadNumber,
    });

    if (existingLead) {
      return res.status(400).json({ message: "Lead number already exists" });
    }

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL LEADS
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE LEAD BY ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LEAD
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    Object.assign(lead, req.body);
    await lead.save();

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LEAD
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.deleteOne();

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
