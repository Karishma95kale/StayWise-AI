const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const User = require("../models/user");

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const mongo_url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staywise";

async function main() {
  await mongoose.connect(mongo_url);
  console.log("Connected to MongoDB");
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  console.log("Cleared existing listings and users.");

  // Create Demo Admin
  const adminUser = new User({
    username: "admin",
    email: "admin@staywise.ai",
    role: "admin",
    phone: "9999999999",
    isVerified: true
  });
  const registeredAdmin = await User.register(adminUser, "admin123");

  // Create Demo Owner
  const ownerUser = new User({
    username: "hostelowner",
    email: "owner@staywise.ai",
    role: "owner",
    phone: "9876543210",
    collegeName: "Delhi University",
    isVerified: true
  });
  const registeredOwner = await User.register(ownerUser, "owner123");

  // Create Demo Student
  const studentUser = new User({
    username: "student",
    email: "student@staywise.ai",
    role: "student",
    phone: "9123456789",
    collegeName: "Delhi University North Campus",
    budget: 12000,
    gender: "Boys",
    isVerified: true
  });
  const registeredStudent = await User.register(studentUser, "student123");

  console.log("Created Demo Accounts:");
  console.log(" - Admin: admin / admin123");
  console.log(" - Owner: hostelowner / owner123");
  console.log(" - Student: student / student123");

  // Attach owner ID to all sample hostels
  const hostels = initData.data.map((obj) => ({
    ...obj,
    owner: registeredOwner._id
  }));

  await Listing.insertMany(hostels);
  console.log(`Successfully seeded ${hostels.length} StayWise AI hostels into DB!`);
  mongoose.connection.close();
};

main().catch(err => {
  console.error("Initialization Error:", err);
});

