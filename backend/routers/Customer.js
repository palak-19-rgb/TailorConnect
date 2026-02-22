var customerController=require("../controllers/Customer");
var express=require("express");
var router=express.Router();

router.post("/Signup",customerController.Signup);
router.post("/Login",customerController.Login);
router.post("/CustomerDetails",customerController.CustomerDetails);
module.exports=router;