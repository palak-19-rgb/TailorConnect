var customerController=require("../controllers/Customer");
var express=require("express");
var router = express.Router();
var verifyToken = require("../middleware/auth");
const { upload } = require("../middleware/upload");
router.post("/Signup", customerController.Signup);                                    // public
router.get("/getByEmail/:email", verifyToken, customerController.getCustomerByEmail);
router.post(
  "/CustomerDetails",
  verifyToken,
  upload.fields([{ name: "profilepic", maxCount: 1 }]),
  customerController.CustomerDetails
);     // 🔒 protected
router.get("/check/:phone", verifyToken, customerController.checkCustomer);
router.get("/saved/:email", verifyToken, customerController.getSavedTailors);
router.post("/save-tailor", verifyToken, customerController.saveTailor);               // 🔒 protected
router.post("/remove-tailor", verifyToken, customerController.removeTailor);           // 🔒 protected

module.exports=router;
