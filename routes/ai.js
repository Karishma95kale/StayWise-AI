const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const aiController = require("../controllers/ai.js");

router.get("/assistant", aiController.renderAssistant);
router.post("/chat", wrapAsync(aiController.chatConcierge));
router.post("/budget", wrapAsync(aiController.calculateBudget));
router.post("/generate-description", wrapAsync(aiController.generateDescription));
router.post("/match-roommate", wrapAsync(aiController.matchRoommate));
router.get("/summarize-reviews", wrapAsync(aiController.summarizeReviews));

module.exports = router;
