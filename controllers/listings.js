const Listing = require("../models/listing");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const { search, college, maxPrice, gender, roomType, mess, wifi, distance } = req.query;
  let filter = { isApproved: true };

  // Search by text query (hostel name, college, location, city)
  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: searchRegex },
      { college: searchRegex },
      { location: searchRegex },
      { description: searchRegex }
    ];
  }

  if (college && college.trim() !== "" && college !== "All") {
    filter.college = new RegExp(college.trim(), "i");
  }

  if (maxPrice && maxPrice.toString().trim() !== "" && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0) {
    filter.price = { $lte: Number(maxPrice) };
  }

  if (gender && gender.trim() !== "" && gender !== "All") {
    filter.gender = gender;
  }

  if (roomType && roomType.trim() !== "" && roomType !== "All") {
    filter.roomType = roomType;
  }

  if (mess === "true") {
    filter.messAvailable = true;
  }

  if (wifi === "true") {
    filter.wifiAvailable = true;
  }

  if (distance && distance.toString().trim() !== "" && !isNaN(Number(distance)) && Number(distance) > 0) {
    filter.distanceFromCollege = { $lte: Number(distance) };
  }

  const allListings = await Listing.find(filter).sort({ aiRecommendationScore: -1, rating: -1 });

  // Get user wishlist IDs if student logged in
  let userWishlist = [];
  if (req.user) {
    const currentUser = await User.findById(req.user._id);
    if (currentUser && currentUser.wishlist) {
      userWishlist = currentUser.wishlist.map(id => id.toString());
    }
  }

  res.render("listing/index", {
    allListings,
    searchQuery: search || "",
    queryFilters: req.query,
    userWishlist
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs", { error: null, listing: {} });
};

module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: { path: "author" }
  }).populate("owner");

  if (!listing) {
    req.flash("error", "Hostel requested does not exist!");
    return res.redirect("/listings");
  }

  // Check if in user's wishlist
  let isWishlisted = false;
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user && user.wishlist) {
      isWishlisted = user.wishlist.includes(listing._id);
    }
  }

  // Find nearby hostels (same college or location)
  const nearbyHostels = await Listing.find({
    _id: { $ne: listing._id },
    $or: [{ college: listing.college }, { location: listing.location }]
  }).limit(3);

  res.render("listing/show.ejs", {
    listing,
    currUser: req.user,
    isWishlisted,
    nearbyHostels
  });
};

module.exports.createlisting = async (req, res, next) => {
  try {
    const hostelData = req.body.listing;
    
    // Safety score calculation
    let calculatedSafety = 85;
    if (hostelData.powerBackup) calculatedSafety += 4;
    if (hostelData.curfewTime && hostelData.curfewTime !== "No Curfew") calculatedSafety += 5;
    if (calculatedSafety > 98) calculatedSafety = 98;

    // AI recommendation score calculation
    let calculatedAiScore = 90;
    if (hostelData.distanceFromCollege && Number(hostelData.distanceFromCollege) <= 1.0) calculatedAiScore += 5;
    if (hostelData.messAvailable) calculatedAiScore += 3;

    const newListing = new Listing({
      ...hostelData,
      owner: req.user._id,
      safetyScore: calculatedSafety,
      aiRecommendationScore: Math.min(calculatedAiScore, 99)
    });

    // Multi-file upload handling or single file fallback
    if (req.files && req.files.length > 0) {
      newListing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
      newListing.image = { url: req.files[0].path, filename: req.files[0].filename };
    } else if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
      newListing.images = [{ url: req.file.path, filename: req.file.filename }];
    } else {
      // Default placeholder image
      newListing.image = {
        url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
        filename: "default_hostel"
      };
      newListing.images = [{ url: newListing.image.url, filename: newListing.image.filename }];
    }

    await newListing.save();
    req.flash("success", "New Student Hostel successfully created & published!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.redirect(`/error?message=${encodeURIComponent(err.message)}`);
    }
    next(err);
  }
};

module.exports.EditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Hostel requested does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image ? listing.image.url : "";
  if (originalImageUrl && originalImageUrl.includes("/upload")) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.files && req.files.length > 0) {
    listing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    listing.image = { url: req.files[0].path, filename: req.files[0].filename };
    await listing.save();
  } else if (typeof req.file !== "undefined") {
    listing.image = { url: req.file.path, filename: req.file.filename };
    listing.images = [{ url: req.file.path, filename: req.file.filename }];
    await listing.save();
  }

  req.flash("success", "Hostel Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Hostel Listing Removed");
  res.redirect("/listings");
};

