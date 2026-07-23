const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);
router.post("/login",
   saveRedirectUrl,
   passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
   }),
   wrapAsync(userController.login)
);

router.get("/logout", userController.logout);
router.post("/wishlist/:hostelId", isLoggedIn, wrapAsync(userController.toggleWishlist));

router.get("/dashboard/student", isLoggedIn, wrapAsync(userController.renderStudentDashboard));
router.get("/dashboard/owner", isLoggedIn, wrapAsync(userController.renderOwnerDashboard));

module.exports = router;