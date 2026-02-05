const Lead = require("../models/Lead");
const Shipment = require("../models/Shipment");
const User = require("../models/User");

// ================= ADMIN =================
exports.getAdminDashboard = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    const pendingQuotes = await Lead.countDocuments({ status: "quote" });
    const activeShipments = await Shipment.countDocuments({ status: "in-transit" });

    // Leads per month
    const leadsPerMonth = await Lead.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Shipment status breakdown
    const shipmentStatus = await Shipment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalLeads,
      totalCustomers,
      pendingQuotes,
      activeShipments,
      leadsPerMonth: leadsPerMonth.map((l) => ({
        month: l._id,
        count: l.count,
      })),
      shipmentStatus: shipmentStatus.map((s) => ({
        status: s._id,
        count: s.count,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Admin dashboard error" });
  }
};

// ================= EMPLOYEE =================
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const assignedLeads = await Lead.countDocuments({
      assignedTo: req.user._id,
    });

    const leadsPerMonth = await Lead.aggregate([
      { $match: { assignedTo: req.user._id } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalLeads: assignedLeads,
      leadsPerMonth: leadsPerMonth.map((l) => ({
        month: l._id,
        count: l.count,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Employee dashboard error" });
  }
};

// ================= CARRIER =================
exports.getCarrierDashboard = async (req, res) => {
  try {
    const shipments = await Shipment.find({ carrier: req.user._id });

    const shipmentStatus = await Shipment.aggregate([
      { $match: { carrier: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalShipments: shipments.length,
      shipmentStatus: shipmentStatus.map((s) => ({
        status: s._id,
        count: s.count,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Carrier dashboard error" });
  }
};

// ================= CUSTOMER =================
exports.getCustomerDashboard = async (req, res) => {
  try {
    const shipments = await Shipment.find({ customer: req.user._id });

    res.json({
      shipments,
    });
  } catch (error) {
    res.status(500).json({ message: "Customer dashboard error" });
  }
};
