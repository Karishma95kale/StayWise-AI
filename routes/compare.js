const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const compareController = require("../controllers/compare.js");

router.get("/", wrapAsync(compareController.renderComparePage));

module.exports = router;
