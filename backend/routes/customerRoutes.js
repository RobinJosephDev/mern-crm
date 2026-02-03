const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const customerController = require("../controllers/customerController");

router.use(protect);

router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", authorize("admin"), customerController.updateCustomer);
router.delete("/:id", authorize("admin"), customerController.deleteCustomer);

module.exports = router;
