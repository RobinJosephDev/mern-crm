const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  contactName: String,
  contactNo: String,
  email: String,
});

const leadSchema = new mongoose.Schema(
  {
    // Lead Info
    leadNumber: {
      type: String,
      required: true,
      unique: true,
    },
    leadDate: {
      type: Date,
      required: true,
    },
    followUpDate: {
      type: Date,
      required: true,
    },
    leadType: {
      type: String,
      required: true,
    },
    leadStatus: {
      type: String,
      enum: ["New", "In Progress", "Follow-up", "Closed"],
      default: "New",
    },

    // Customer Details
    customerName: String,
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: String,
    equipmentType: String,

    // Address
    address: {
      addressLine: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      unitNo: String,
    },

    // Contacts
    contacts: [contactSchema],

    notes: String,

    // System fields
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", leadSchema);
