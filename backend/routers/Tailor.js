var tailorController = require("../controllers/Tailor");
var express = require("express");
var router = express.Router();

router.post("/Signup", tailorController.Signup);
router.post("/TailorDetails", tailorController.TailorDetails);
router.get("/getByEmail/:email", tailorController.getTailorByEmail);
router.post("/extract-aadhaar", tailorController.doExtractAadhaar);
router.get("/tailorprofile/:mobile", tailorController.getTailorProfile);
router.post("/addReview", tailorController.addReview);
router.get("/reviews/:mobile", tailorController.getReviews);
router.get("/tailors", tailorController.getTailors);
router.post("/add-portfolio", tailorController.addPortfolio);
router.get("/get-portfolio/:email", tailorController.getPortfolio);
router.post("/delete-portfolio", tailorController.deletePortfolio);
router.post("/update-portfolio", tailorController.updatePortfolio);
router.post("/update-single-image", tailorController.updateSingleImage);
router.get("/tailor/:id", tailorController.getFullTailorProfile);



module.exports = router;