const express = require("express");
const router = express.Router();
const { chatWithBot, chatWithTailor } = require("../controllers/Chatbot"); 

router.post("/message", chatWithBot);
router.post("/tailor-message", chatWithTailor);

module.exports = router;