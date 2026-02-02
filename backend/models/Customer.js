const mongoose = require("mongoose");

/* -------------------- SUB SCHEMAS -------------------- */

// Address (reusable)
const addressSchema = new mongoose.Schema(
  {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    unitNo: String,
  },
  { _id: false },
);

// Multiple Contacts
const contactSchema = new mongoose.Schema(
  {
    contactName: String,
    contactNo: String,
    contactNoExt: String,
    email: String,
    fax: String,
    designation: String,
  },
  { _id: false },
);

// Accounts Payable
const accountsPayableSchema = new mongoose.Schema(
  {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    unitNo: String,
    email: String,
    phone: String,
    phoneExt: String,
    fax: String,
  },
  { _id: false },
);

// Credit Details
const creditSchema = new mongoose.Schema(
  {
    creditStatus: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },
    modeOfPayment: {
      type: String,
      enum: ["Direct Deposit", "Cheque", "Wire", "Other"],
    },
    approvalDate: Date,
    expiryDate: Date,
    termsDays: Number,
    limit: Number,
    notes: String,
    currency: {
      type: String,
      enum: ["Canadian", "USD"],
      default: "Canadian",
    },
    creditApplicationFile: String, // file path
    creditAgreementFile: String, // file path
    shipperBrokerAgreement: Boolean,
  },
  { _id: false },
);

const customerRefNo = `CUST-${Date.now()}`;
/* -------------------- CUSTOMER SCHEMA -------------------- */

const customerSchema = new mongoose.Schema(
  {
    /* -------- BASIC INFO -------- */
    customerType: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerRefNo: {
      type: String,
      unique: true,
    },

    website: String,
    email: String,
    contactNo: String,
    contactNoExt: String,
    taxId: String,

    /* -------- ADDRESSES -------- */
    primaryAddress: addressSchema,

    mailingAddress: {
      sameAsPrimary: {
        type: Boolean,
        default: false,
      },
      address: addressSchema,
    },

    accountsPayable: accountsPayableSchema,

    /* -------- CUSTOM BROKER -------- */
    customBroker: {
      broker: String,
    },

    /* -------- NOTES -------- */
    paymentNotes: String,
    specialNotes: String,

    /* -------- CREDIT -------- */
    credit: creditSchema,

    /* -------- MULTIPLE CONTACTS -------- */
    contacts: [contactSchema],

    /* -------- SYSTEM -------- */
    convertedFromLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);
