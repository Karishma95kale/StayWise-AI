const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

router.get("/", isLoggedIn, isAdmin, wrapAsync(adminController.renderAdminDashboard));
router.post("/approve/:id", isLoggedIn, isAdmin, wrapAsync(adminController.approveListing));
router.post("/verify-user/:id", isLoggedIn, isAdmin, wrapAsync(adminController.toggleUserStatus));

module.exports = router;
