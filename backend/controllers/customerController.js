const Customer = require("../models/Customer");
const Lead = require("../models/Lead");

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
    const data = { ...req.body };

    // --- Parse JSON strings back to objects ---
    if (data.primaryAddress && typeof data.primaryAddress === "string") {
      data.primaryAddress = JSON.parse(data.primaryAddress);
    }

    if (data.contacts && typeof data.contacts === "string") {
      data.contacts = JSON.parse(data.contacts);
    }

    // --- Handle uploaded files ---
    if (req.files?.creditAgreement) {
      data.creditAgreement = req.files.creditAgreement[0].path;
    }

    if (req.files?.shipperBrokerAgreement) {
      data.shipperBrokerAgreement = req.files.shipperBrokerAgreement[0].path;
    }

    // --- Handle boolean ---
    if (data.creditApplication !== undefined) {
      data.creditApplication = data.creditApplication === "true" || data.creditApplication === true;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, data, { new: true })
      .populate("createdBy", "name email")
      .populate("convertedFromLead", "leadNumber customerName");

    if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });

    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);
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
