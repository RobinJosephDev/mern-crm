const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const { createShipment, getShipments, getShipmentById, updateShipment, deleteShipment } = require("../controllers/shipmentController");

router.use(protect);

/* -------------------- CREATE SHIPMENT -------------------- */
router.post("/", authorize("carrier"), createShipment);

/* -------------------- GET ALL SHIPMENTS -------------------- */
router.get("/", authorize("carrier", "customer"), getShipments);

/* -------------------- GET SHIPMENT BY ID -------------------- */
router.get("/:id", authorize("carrier", "customer"), validateObjectId, getShipmentById);

/* -------------------- UPDATE SHIPMENT -------------------- */
router.put("/:id", authorize("carrier"), validateObjectId, updateShipment);

/* -------------------- DELETE SHIPMENT -------------------- */
router.delete("/:id", authorize("carrier"), validateObjectId, deleteShipment);

module.exports = router;
