const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");

const { createFollowUp, getFollowUp, getFollowUpById, updateFollowUp, deleteFollowUp } = require("../controllers/followUpController");

router.use(protect);

router.post("/", authorize("employee"), createFollowUp);
router.get("/", authorize("employee"), getFollowUp);
router.get("/:id", authorize("employee"), validateObjectId, getFollowUpById);

router.put("/:id", authorize("employee"), validateObjectId, updateFollowUp);
router.delete("/:id", authorize("employee"), validateObjectId, deleteFollowUp);

module.exports = router;
