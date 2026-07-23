const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Hostel requested does not exist!");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New Review Created");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};

module.exports.toggleLikeReview = async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ success: false, message: "Review not found" });
  }

  const userId = req.user._id;
  const index = review.likes.indexOf(userId);
  let action = '';
  if (index > -1) {
    review.likes.splice(index, 1);
    action = 'unliked';
  } else {
    review.likes.push(userId);
    action = 'liked';
  }
  await review.save();

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.json({ success: true, action, likesCount: review.likes.length });
  }

  res.redirect("back");
};

module.exports.ownerReplyReview = async (req, res) => {
  const { reviewId } = req.params;
  const { response } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found.");
    return res.redirect("back");
  }

  review.ownerResponse = response;
  await review.save();

  req.flash("success", "Response submitted to student review!");
  res.redirect("back");
};