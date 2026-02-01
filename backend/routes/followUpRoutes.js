const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const { createFollowUp, getFollowUp, getFollowUpById, updateFollowUp, deleteFollowUp } = require("../controllers/followUpController");

router.use(protect);

router.post("/", authorize("admin", "employee"), createFollowUp);
router.get("/", authorize("admin", "employee"), getFollowUp);
router.get("/:id", authorize("admin", "employee"), validateObjectId, getFollowUpById);

router.put("/:id", authorize("admin", "employee"), validateObjectId, updateFollowUp);
router.delete("/:id", authorize("admin"), validateObjectId, deleteFollowUp);

module.exports = router;
