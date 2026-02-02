const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const customerController = require("../controllers/customerController");

router.use(protect);

router.post("/", authorize("admin"), customerController.createCustomer);
router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", authorize("admin"), customerController.updateCustomer);
router.delete("/:id", authorize("admin"), customerController.deleteCustomer);

// Lead → Customer
router.post("/convert/:leadId", authorize("admin"), customerController.convertLeadToCustomer);

module.exports = router;
