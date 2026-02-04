const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const { createShipment, getShipments, getShipmentById, updateShipment, deleteShipment } = require("../controllers/shipmentController");

router.use(protect);

/* -------------------- CREATE SHIPMENT -------------------- */
router.post("/", authorize("admin", "employee"), createShipment);

/* -------------------- GET ALL SHIPMENTS -------------------- */
router.get("/", authorize("admin", "employee"), getShipments);

/* -------------------- GET SHIPMENT BY ID -------------------- */
router.get("/:id", authorize("admin", "employee"), validateObjectId, getShipmentById);

/* -------------------- UPDATE SHIPMENT -------------------- */
router.put("/:id", authorize("admin", "employee"), validateObjectId, updateShipment);

/* -------------------- DELETE SHIPMENT -------------------- */
router.delete("/:id", authorize("admin"), validateObjectId, deleteShipment);

module.exports = router;
