const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Post review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

// Like review
router.post("/:reviewId/like", isLoggedIn, wrapAsync(reviewController.toggleLikeReview));

// Owner reply to review
router.post("/:reviewId/reply", isLoggedIn, wrapAsync(reviewController.ownerReplyReview));

module.exports = router;