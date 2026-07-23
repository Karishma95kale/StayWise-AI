const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

// ================= SIGNUP =================

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

// ================= LOGIN =================

router.get("/login", userController.renderLoginForm);

router.post("/login", (req, res, next) => {

    console.log("========== LOGIN REQUEST ==========");
    console.log("BODY:", req.body);

    passport.authenticate("local", (err, user, info) => {

        console.log("ERROR:", err);
        console.log("USER :", user);
        console.log("INFO :", info);

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

            console.log("LOGIN SUCCESS");
            console.log(req.user);

            req.flash("success", `Welcome back, ${user.username}!`);

            const redirectUrl = req.session.redirectUrl;

            delete req.session.redirectUrl;

            if (redirectUrl) {
                return res.redirect(redirectUrl);
            }

            if (user.role === "admin") {
                return res.redirect("/dashboard/admin");
            }

            if (user.role === "owner") {
                return res.redirect("/dashboard/owner");
            }

            return res.redirect("/dashboard/student");

        });

    })(req, res, next);

});

// ================= LOGOUT =================

router.get("/logout", userController.logout);

// ================= WISHLIST =================

router.post(
    "/wishlist/:hostelId",
    isLoggedIn,
    wrapAsync(userController.toggleWishlist)
);

// ================= DASHBOARDS =================

router.get(
    "/dashboard/student",
    isLoggedIn,
    wrapAsync(userController.renderStudentDashboard)
);

router.get(
    "/dashboard/owner",
    isLoggedIn,
    wrapAsync(userController.renderOwnerDashboard)
);

module.exports = router;