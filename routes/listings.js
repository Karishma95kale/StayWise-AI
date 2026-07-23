const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isOwnerRole } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route (Hostel Feed & Search)
router.get("/", wrapAsync(listingController.index));

// New request route (Form for property owners)
router.get("/new", isLoggedIn, isOwnerRole, listingController.renderNewForm);

// Show route (Hostel details)
router.get("/:id", wrapAsync(listingController.showListings));

// Create route (Upload up to 5 images)
router.post(
  "/",
  isLoggedIn,
  isOwnerRole,
  upload.array('listing[images]', 5),
  validateListing,
  wrapAsync(listingController.createlisting)
);

// Edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.EditForm));

// Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.array('listing[images]', 5),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;