const Listing = require("../models/listing");

module.exports.renderComparePage = async (req, res) => {
  const { id1, id2, id3 } = req.query;
  const hostelIds = [id1, id2, id3].filter(Boolean);

  let selectedHostels = [];
  if (hostelIds.length > 0) {
    selectedHostels = await Listing.find({ _id: { $in: hostelIds } });
  }

  const allHostels = await Listing.find({ isApproved: true }).select("_id title college location price");

  res.render("hostel/compare.ejs", {
    selectedHostels,
    allHostels,
    id1: id1 || "",
    id2: id2 || "",
    id3: id3 || ""
  });
};
