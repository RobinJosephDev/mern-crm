const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { getAdminDashboard, getEmployeeDashboard, getCarrierDashboard, getCustomerDashboard } = require("../controllers/dashboardController");

// Protect all dashboard routes
router.use(protect);

// Role-based dashboards
router.get("/admin", authorize("admin"), getAdminDashboard);
router.get("/employee", authorize("employee"), getEmployeeDashboard);
router.get("/carrier", authorize("carrier"), getCarrierDashboard);
router.get("/customer", authorize("customer"), getCustomerDashboard);

module.exports = router;
