var tailorController=require("../controllers/Tailor");
var express=require("express");
var router=express.Router();

router.post("/Signup",tailorController.Signup);
router.post("/Login",tailorController.Login);
router.post("/TailorDetails",tailorController.TailorDetails);
router.post("/extract-aadhaar", tailorController.doExtractAadhaar);
module.exports=router;