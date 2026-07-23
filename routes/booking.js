const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking, isStudent } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// Submit booking
router.post("/", isLoggedIn, isStudent, validateBooking, wrapAsync(bookingController.createBooking));

// View booking receipt
router.get("/:id", isLoggedIn, wrapAsync(bookingController.showBooking));

// Update status (Confirm / Cancel)
router.post("/:id/status", isLoggedIn, wrapAsync(bookingController.updateBookingStatus));

module.exports = router;
