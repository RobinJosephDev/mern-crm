const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

/* -------------------- CREATE CUSTOMER -------------------- */
exports.createCustomer = async (req, res) => {
  try {
    if (!req.body.customerName || !req.body.customerType) {
      return res.status(400).json({
        message: "Customer name and customer type are required",
      });
    }

    // Optional uniqueness check
    if (req.body.customerRefNo) {
      const existing = await Customer.findOne({
        customerRefNo: req.body.customerRefNo,
      });

      if (existing) {
        return res.status(400).json({
          message: "Customer reference number already exists",
        });
      }
    }

    const customer = await Customer.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- GET ALL CUSTOMERS -------------------- */
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("createdBy", "name email")
      .populate("convertedFromLead", "leadNumber customerName")
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- GET CUSTOMER BY ID -------------------- */
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("convertedFromLead", "leadNumber customerName");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- UPDATE CUSTOMER -------------------- */
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("createdBy", "name email")
      .populate("convertedFromLead", "leadNumber customerName");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- DELETE CUSTOMER -------------------- */
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.deleteOne();
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- CONVERT LEAD TO CUSTOMER -------------------- */
exports.convertLeadToCustomer = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.leadId);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Prevent double conversion
    const alreadyConverted = await Customer.findOne({
      convertedFromLead: lead._id,
    });

    if (alreadyConverted) {
      return res.status(400).json({
        message: "This lead has already been converted to a customer",
      });
    }

    // Create customer using lead data
    const customer = await Customer.create({
      customerType: "Customer",
      customerName: lead.customerName,
      email: lead.email,
      contactNo: lead.phone,
      website: lead.website,
      primaryAddress: {
        street: lead.address?.addressLine,
        city: lead.address?.city,
        state: lead.address?.state,
        country: lead.address?.country,
        postalCode: lead.address?.postalCode,
        unitNo: lead.address?.unitNo,
      },
      contacts: lead.contacts,
      convertedFromLead: lead._id,
      createdBy: req.user.id,
    });

    // Update lead status
    lead.leadStatus = "Customer";
    await lead.save();

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Conversion failed" });
  }
};
