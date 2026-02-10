const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const { emailQueue } = require("../queues/email.queue");
const { EMAIL_JOB_TYPES } = require("../emails/email.types");

// CREATE LEAD
exports.createLead = async (req, res) => {
  try {
    const { leadNumber, phone, email, customerName, assignedTo } = req.body;

    if (!leadNumber || !phone || !email) {
      return res.status(400).json({ message: "Lead number, phone, and email are required" });
    }

    const existingLead = await Lead.findOne({ leadNumber });
    if (existingLead) return res.status(400).json({ message: "Lead number already exists" });

    const lead = await Lead.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Send email to assigned user
    if (assignedTo) {
      await emailQueue.add(EMAIL_JOB_TYPES.LEAD_ASSIGNED, {
        userId: assignedTo,
        leadName: customerName || leadNumber,
      });
    }

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL LEADS
exports.getLeads = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "employee") {
      filter.assignedTo = req.user.id;
    }

    const leads = await Lead.find(filter).populate("assignedTo", "name email").populate("createdBy", "name email").sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET LEADS WITH QUOTES
exports.getLeadsWithQuotes = async (req, res) => {
  try {
    const leads = await Lead.find({ leadStatus: "Quotations" })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE LEAD
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate("assignedTo", "name email role").populate("createdBy", "name email role");

    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE LEAD
exports.updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });

    // Send email if assignedTo changed
    if (req.body.assignedTo) {
      await emailQueue.add(EMAIL_JOB_TYPES.LEAD_ASSIGNED, {
        userId: req.body.assignedTo,
        leadName: updatedLead.customerName || updatedLead.leadNumber,
      });
    }

    res.json(updatedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE LEAD
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await lead.deleteOne();
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// CONVERT LEAD TO CUSTOMER
exports.convertLeadToCustomer = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    if (lead.isConverted) return res.status(400).json({ message: "Lead already converted" });

    const customerRefNo = `CUST-${Date.now()}`;

    const customer = await Customer.create({
      customerType: "Regular",
      customerName: lead.customerName,
      email: lead.email,
      contactNo: lead.phone,
      website: lead.website,
      customerRefNo,
      primaryAddress: {
        street: lead.address?.addressLine,
        city: lead.address?.city,
        state: lead.address?.state,
        country: lead.address?.country,
        postalCode: lead.address?.postalCode,
        unitNo: lead.address?.unitNo,
      },
      contacts: lead.contacts || [],
      convertedFromLead: lead._id,
      createdBy: req.user.id,
    });

    lead.isConverted = true;
    lead.convertedCustomer = customer._id;
    lead.leadStatus = "Quotations";
    await lead.save();

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// FOLLOW-UP REMINDER (called from cron/job)
exports.sendFollowUpReminder = async (leadId) => {
  const lead = await Lead.findById(leadId);
  if (!lead || !lead.assignedTo) return;

  await emailQueue.add(EMAIL_JOB_TYPES.FOLLOW_UP_DUE, {
    userId: lead.assignedTo.toString(),
    leadName: lead.customerName || lead.leadNumber,
  });
};
