const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/TailorCustomer");
const verifyToken = require("../middleware/auth");   


router.post("/add", verifyToken, ctrl.addClient);                      // 🔒 protected
router.get("/customer/:email", ctrl.getCustomerOrders);                // public
router.get("/analytics/:tailorId", verifyToken, ctrl.getAnalytics);    // 🔥 YE UPAR LE AAYA
router.get("/:tailorId", verifyToken, ctrl.getClients);                // 🔒 protected
router.post("/update-measurements", verifyToken, ctrl.updateMeasurements);
router.post("/delete", verifyToken, ctrl.deleteClient);
router.post("/update-status", verifyToken, ctrl.updateStatus);

module.exports = router;