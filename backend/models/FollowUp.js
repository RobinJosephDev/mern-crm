const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: String,
  quantity: String,
});

const contactSchema = new mongoose.Schema({
  contactName: String,
  contactNo: String,
  email: String,
});

const FollowUpSchema = new mongoose.Schema(
  {
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
    followUpDate: {
      type: Date,
      required: true,
    },

    followUpType: {
      type: String,
      enum: ["Email", "Call Customer"],
      default: "Email",
    },
    remarks: {
      type: String,
      required: true,
    },
    equipmentType: {
      type: String,
      enum: ["Van", "Reefer", "Flatbed", "Triaxle", "Maxi", "Btrain", "Roll tite"],
      default: "Van",
    },
    // Products
    products: [productSchema],
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
    leadType: {
      type: String,
      required: true,
    },

    // Address
    address: {
      addressLine: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      unitNo: String,
    },

    notes: String,

    // Contacts
    contacts: [contactSchema],

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

module.exports = mongoose.model("FollowUp", FollowUpSchema);
