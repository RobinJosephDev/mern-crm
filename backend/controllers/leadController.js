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
// GET ALL LEADS (role-based)
exports.getLeads = async (req, res) => {
  try {
    let filter = {};

    // If logged-in user is EMPLOYEE → only their assigned leads
    if (req.user.role === "employee") {
      filter.assignedTo = req.user.id;
    }

    const leads = await Lead.find(filter).populate("assignedTo", "name email").populate("createdBy", "name email").sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Leads with Quotes
exports.getLeadsWithQuotes = async (req, res) => {
  try {
    const leads = await Lead.find({ leadStatus: "Quotations" }).sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE LEAD BY ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email role").populate("createdBy", "name email role");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LEAD
// UPDATE LEAD
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updatedLead);
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
