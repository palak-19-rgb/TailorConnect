var tailorController = require("../controllers/Tailor");
var express = require("express");
var router = express.Router();
var verifyToken = require("../middleware/auth");          

router.post("/Signup", tailorController.Signup);                                       // public
router.post("/TailorDetails", verifyToken, tailorController.TailorDetails);           // 🔒 protected
router.get("/getByEmail/:email", tailorController.getTailorByEmail);                   // public
router.post("/extract-aadhaar", verifyToken, tailorController.doExtractAadhaar);       // 🔒 protected
router.get("/tailorprofile/:mobile", tailorController.getTailorProfile);               // public
router.post("/addReview", verifyToken, tailorController.addReview);                    // 🔒 protected
router.get("/reviews/:mobile", tailorController.getReviews);                           // public
router.get("/tailors", tailorController.getTailors);                                   // public
router.post("/add-portfolio", verifyToken, tailorController.addPortfolio);             // 🔒 protected
router.get("/get-portfolio/:email", tailorController.getPortfolio);                    // public
router.post("/delete-portfolio", verifyToken, tailorController.deletePortfolio);       // 🔒 protected
router.post("/update-portfolio", verifyToken, tailorController.updatePortfolio);       // 🔒 protected
router.post("/update-single-image", verifyToken, tailorController.updateSingleImage);  // 🔒 protected
router.get("/tailor/:id", tailorController.getFullTailorProfile);        

module.exports = router;