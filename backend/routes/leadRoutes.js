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
} = require("../controllers/leadController");

router.use(protect);

router.post("/", authorize("admin", "employee"), createLead);
router.get("/", authorize("admin", "employee"), getLeads);
router.get(
  "/:id",
  authorize("admin", "employee"),
  validateObjectId,
  getLeadById,
);

router.put(
  "/:id",
  authorize("admin", "employee"),
  validateObjectId,
  updateLead,
);
router.delete("/:id", authorize("admin"), validateObjectId, deleteLead);

module.exports = router;
