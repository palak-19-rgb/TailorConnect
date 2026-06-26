var customerController=require("../controllers/Customer");
var express=require("express");
var router = express.Router();
var verifyToken = require("../middleware/auth");

router.post("/Signup", customerController.Signup);                                    // public
router.get("/getByEmail/:email", customerController.getCustomerByEmail);              // public (ya protect karo agar chaho)
router.post("/CustomerDetails", verifyToken, customerController.CustomerDetails);     // 🔒 protected
router.get("/check/:phone", customerController.checkCustomer);                         // public
router.get("/saved/:email", customerController.getSavedTailors);                       // public
router.post("/save-tailor", verifyToken, customerController.saveTailor);               // 🔒 protected
router.post("/remove-tailor", verifyToken, customerController.removeTailor);           // 🔒 protected

module.exports=router;