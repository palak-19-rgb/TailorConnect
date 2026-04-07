const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/TailorCustomer");

router.post("/add", ctrl.addClient);
router.get("/customer/:email", ctrl.getCustomerOrders);
router.get("/:tailorId", ctrl.getClients);
router.post("/update-measurements", ctrl.updateMeasurements);
router.post("/delete", ctrl.deleteClient);
router.post("/update-status", ctrl.updateStatus);



module.exports = router;