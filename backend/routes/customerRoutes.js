const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const customerController = require("../controllers/customerController");
const upload = require("../middleware/upload"); // ✅ import multer

router.use(protect);

router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomerById);

// UPDATE route with multer
router.put(
  "/:id",
  authorize("admin"),
  upload.fields([
    { name: "creditAgreement", maxCount: 1 },
    { name: "shipperBrokerAgreement", maxCount: 1 },
  ]),
  customerController.updateCustomer,
);

router.delete("/:id", authorize("admin"), customerController.deleteCustomer);

module.exports = router;
