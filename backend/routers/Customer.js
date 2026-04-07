var customerController=require("../controllers/Customer");
var express=require("express");
var router = express.Router();

router.post("/Signup",customerController.Signup);
router.get("/getByEmail/:email", customerController.getCustomerByEmail);
router.post("/CustomerDetails",customerController.CustomerDetails);
router.get("/check/:phone", customerController.checkCustomer);
router.get("/saved/:email", customerController.getSavedTailors);
router.post("/save-tailor", customerController.saveTailor);
router.post("/remove-tailor", customerController.removeTailor);
module.exports=router;