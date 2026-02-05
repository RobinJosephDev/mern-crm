const Shipment = require("../models/ShipmentQuote");

/* -------------------- GET ALL SHIPMENTS WITH QUOTES-------------------- */
exports.getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate("customer", "customerName customerRefNo")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- GET SHIPMENT QUOTE BY ID -------------------- */
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate("customer", "customerName customerRefNo").populate("createdBy", "name email");

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- CREATE SHIPMENT WITH QUOTE-------------------- */
exports.createShipment = async (req, res) => {
  try {
    const data = { ...req.body };

    // --- Parse JSON strings ---
    if (data.pickupLocation && typeof data.pickupLocation === "string") {
      data.pickupLocation = JSON.parse(data.pickupLocation);
    }

    if (data.deliveryLocation && typeof data.deliveryLocation === "string") {
      data.deliveryLocation = JSON.parse(data.deliveryLocation);
    }

    // --- Convert numbers ---
    if (data.weight !== undefined) {
      data.weight = Number(data.weight);
    }

    if (data.price !== undefined) {
      data.price = Number(data.price);
    }

    // --- Convert booleans ---
    if (data.tarpRequired !== undefined) {
      data.tarpRequired = data.tarpRequired === "true" || data.tarpRequired === true;
    }

    // --- Attach creator ---
    data.createdBy = req.user._id;

    const shipment = await Shipment.create(data);

    const populatedShipment = await Shipment.findById(shipment._id)
      .populate("customer", "customerName customerRefNo")
      .populate("createdBy", "name email");

    res.status(201).json(populatedShipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- UPDATE SHIPMENT WITH QUOTE-------------------- */
exports.updateShipment = async (req, res) => {
  try {
    const data = { ...req.body };

    // --- Parse JSON strings ---
    if (data.pickupLocation && typeof data.pickupLocation === "string") {
      data.pickupLocation = JSON.parse(data.pickupLocation);
    }

    if (data.deliveryLocation && typeof data.deliveryLocation === "string") {
      data.deliveryLocation = JSON.parse(data.deliveryLocation);
    }

    // --- Convert numbers ---
    if (data.weight !== undefined) {
      data.weight = Number(data.weight);
    }

    if (data.price !== undefined) {
      data.price = Number(data.price);
    }

    // --- Convert booleans ---
    if (data.tarpRequired !== undefined) {
      data.tarpRequired = data.tarpRequired === "true" || data.tarpRequired === true;
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      .populate("customer", "customerName customerRefNo")
      .populate("createdBy", "name email");

    if (!updatedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    res.json(updatedShipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- DELETE SHIPMENT WITH QUOTE-------------------- */
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    await shipment.deleteOne();
    res.json({ message: "Shipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
