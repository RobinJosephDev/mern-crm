const mongoose = require("mongoose");

/* -------------------- LOCATION SUBSCHEMA -------------------- */
const locationSchema = new mongoose.Schema(
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

/* -------------------- SHIPMENT SCHEMA -------------------- */
const shipmentSchema = new mongoose.Schema(
  {
    // Shipment Info
    shipmentNumber: {
      type: String,
      unique: true,
    },

    loadDate: {
      type: Date,
      required: true,
    },

    pickupLocation: locationSchema,

    deliveryLocation: locationSchema,

    driverType: {
      type: String,
      enum: ["Team", "Single"],
    },

    weight: {
      type: Number,
    },

    shipmentType: {
      type: String,
      enum: ["FTL", "LTL"],
    },

    tarpRequired: {
      type: Boolean,
      default: false,
    },

    equipment: {
      type: String,
    },

    price: {
      type: Number,
    },

    notes: {
      type: String,
    },

    // Relations
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    // System fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Shipment", shipmentSchema);
