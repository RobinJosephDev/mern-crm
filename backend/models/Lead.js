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
      enum: [
        "Prospect customer",
        "Lanes discussed",
        "Product/Equipment discussed",
        "Email sent to concerened person",
        "Carrier portal registration",
        "Quotations",
        "Fob/have broker",
        "Voicemail/no answer",
        "Different department",
        "No answer/callback/Voicemail",
        "Not interested reason provided in notes",
        "Asset based only",
      ],
      default: "Prospect customer",
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
    isConverted: {
      type: Boolean,
      default: false,
    },
    convertedCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Lead", leadSchema);
