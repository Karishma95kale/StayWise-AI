const Booking = require("../models/booking");
const Listing = require("../models/listing");
const Notification = require("../models/notification");

module.exports.createBooking = async (req, res) => {
  const { hostelId, roomType, moveInDate, durationMonths, specialRequests } = req.body.booking;

  const hostel = await Listing.findById(hostelId);
  if (!hostel) {
    req.flash("error", "Hostel not found.");
    return res.redirect("/listings");
  }

  if (hostel.availableBeds <= 0) {
    req.flash("error", "Sorry, no available beds remaining in this hostel.");
    return res.redirect(`/listings/${hostelId}`);
  }

  const duration = durationMonths ? Number(durationMonths) : 11;
  const totalAmount = hostel.price * duration;

  const newBooking = new Booking({
    hostel: hostelId,
    student: req.user._id,
    roomType: roomType || hostel.roomType,
    moveInDate: new Date(moveInDate),
    durationMonths: duration,
    totalAmount,
    specialRequests: specialRequests || "",
    status: "pending",
    paymentStatus: "paid" // Simulated instant payment
  });

  await newBooking.save();

  // Create notification for Owner
  const ownerNotice = new Notification({
    user: hostel.owner,
    title: "New Room Booking Request!",
    message: `Student ${req.user.username} requested a room reservation at ${hostel.title}.`,
    type: "booking"
  });
  await ownerNotice.save();

  // Create notification for Student
  const studentNotice = new Notification({
    user: req.user._id,
    title: "Booking Requested Successfully",
    message: `Your reservation request for ${hostel.title} is submitted and pending confirmation.`,
    type: "booking"
  });
  await studentNotice.save();

  req.flash("success", "Room Booking request submitted successfully!");
  res.redirect(`/bookings/${newBooking._id}`);
};

module.exports.showBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id).populate({
    path: "hostel",
    populate: { path: "owner" }
  }).populate("student");

  if (!booking) {
    req.flash("error", "Booking record not found.");
    return res.redirect("/dashboard/student");
  }

  res.render("bookings/show.ejs", { booking });
};

module.exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id).populate("hostel");
  if (!booking) {
    req.flash("error", "Booking record not found.");
    return res.redirect("back");
  }

  booking.status = status;
  await booking.save();

  // If confirmed, update available beds
  if (status === "confirmed" && booking.hostel.availableBeds > 0) {
    await Listing.findByIdAndUpdate(booking.hostel._id, { $inc: { availableBeds: -1 } });
  }

  // Notify student
  const studentNotice = new Notification({
    user: booking.student,
    title: `Booking ${status.toUpperCase()}`,
    message: `Your room booking for ${booking.hostel.title} has been ${status}.`,
    type: "booking"
  });
  await studentNotice.save();

  req.flash("success", `Booking status updated to ${status}.`);
  res.redirect("back");
};
