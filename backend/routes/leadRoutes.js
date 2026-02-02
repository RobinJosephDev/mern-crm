const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsWithQuotes,
  convertLeadToCustomer,
} = require("../controllers/leadController");

// Protect all routes
router.use(protect);

// Standard Leads routes
router.post("/", authorize("admin", "employee"), createLead);
router.get("/", authorize("admin", "employee"), getLeads);
router.get("/with-quotes", authorize("admin"), getLeadsWithQuotes);
router.get("/:id", authorize("admin", "employee"), validateObjectId, getLeadById);
router.put("/:id", authorize("admin", "employee"), validateObjectId, updateLead);
router.delete("/:id", authorize("admin"), validateObjectId, deleteLead);
router.post("/:id/convert", protect, authorize("admin"), convertLeadToCustomer);

module.exports = router;
