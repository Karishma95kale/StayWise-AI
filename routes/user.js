const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);
router.post("/login", saveRedirectUrl, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {

        console.log("========== LOGIN DEBUG ==========");
        console.log("Request Body:", req.body);
        console.log("Error:", err);
        console.log("User:", user);
        console.log("Info:", info);

        if (err) {
            return next(err);
        }

        if (!user) {
            req.flash("error", info?.message || "Invalid username or password");
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            req.user = user;
            return userController.login(req, res);
        });

    })(req, res, next);
});

router.get("/logout", userController.logout);
router.post("/wishlist/:hostelId", isLoggedIn, wrapAsync(userController.toggleWishlist));

router.get("/dashboard/student", isLoggedIn, wrapAsync(userController.renderStudentDashboard));
router.get("/dashboard/owner", isLoggedIn, wrapAsync(userController.renderOwnerDashboard));

module.exports = router;