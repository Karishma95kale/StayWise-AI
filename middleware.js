const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema, bookingSchema } = require("./schema.js");
const Listing = require('./models/listing.js');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to access this feature.");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        if (!req.session.redirectUrl.includes("/login") && !req.session.redirectUrl.includes("/signup")) {
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        delete req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Hostel not found.");
        return res.redirect("/listings");
    }
    // Allow owner or admin
    if (!listing.owner._id.equals(res.locals.curruser._id) && res.locals.curruser.role !== 'admin') {
        req.flash("error", "Permission denied. Only the property owner can modify this hostel.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isStudent = (req, res, next) => {
    if (req.user && req.user.role !== 'student' && req.user.role !== 'admin') {
        req.flash("error", "This area is restricted to student accounts.");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isOwnerRole = (req, res, next) => {
    if (req.user && req.user.role !== 'owner' && req.user.role !== 'admin') {
        req.flash("error", "This portal is reserved for Property Owners & Managers.");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') {
        req.flash("error", "Access denied. Administrator privilege required.");
        return res.redirect("/listings");
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        return res.status(400).render("listing/new", {
            listing: req.body.listing || {},
            error: msg
        });
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(res.locals.curruser._id) && res.locals.curruser.role !== 'admin') {
        req.flash("error", "You can only delete your own reviews.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

