const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/booking");

module.exports.renderAdminDashboard = async (req, res) => {
  const pendingListings = await Listing.find({ isApproved: false }).populate("owner");
  const approvedListings = await Listing.find({ isApproved: true }).populate("owner");
  const allUsers = await User.find({});
  const allBookings = await Booking.find({}).populate("hostel student");

  // Calculate platform analytics
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  res.render("dashboard/admin.ejs", {
    pendingListings,
    approvedListings,
    allUsers,
    allBookings,
    stats: {
      totalHostels: approvedListings.length,
      pendingCount: pendingListings.length,
      totalUsers: allUsers.length,
      totalBookings: allBookings.length,
      totalRevenue
    }
  });
};

module.exports.approveListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { isApproved: true });
  req.flash("success", "Hostel listing approved and published live!");
  res.redirect("/dashboard/admin");
};

module.exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    user.isVerified = !user.isVerified;
    await user.save();
    req.flash("success", `User ${user.username} verification status updated to ${user.isVerified}.`);
  }
  res.redirect("/dashboard/admin");
};
