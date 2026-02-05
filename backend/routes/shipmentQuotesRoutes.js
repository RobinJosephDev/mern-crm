const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const { createShipment, getShipments, getShipmentById, updateShipment, deleteShipment } = require("../controllers/shipmentQuoteController");

router.use(protect);

/* -------------------- CREATE SHIPMENT WITH QUOTE-------------------- */
router.post("/", authorize("carrier"), createShipment);

/* -------------------- GET ALL SHIPMENTS WITH QUOTES-------------------- */
router.get("/", authorize("carrier", "admin"), getShipments);

/* -------------------- GET SHIPMENT QUOTE BY ID -------------------- */
router.get("/:id", authorize("carrier", "admin"), validateObjectId, getShipmentById);

/* -------------------- UPDATE SHIPMENT WITH QUOTE-------------------- */
router.put("/:id", authorize("carrier"), validateObjectId, updateShipment);

/* -------------------- DELETE SHIPMENT WITH QUOTE-------------------- */
router.delete("/:id", authorize("carrier"), validateObjectId, deleteShipment);

module.exports = router;
