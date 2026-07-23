const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password, role, phone, collegeName, budget, gender } = req.body;
        const selectedRole = ['student', 'owner'].includes(role) ? role : 'student';
        
        const newUser = new User({
            email,
            username,
            role: selectedRole,
            phone: phone || '',
            collegeName: collegeName || '',
            budget: budget ? Number(budget) : 10000,
            gender: gender || 'Any',
            isVerified: true
        });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", `Welcome to StayWise AI, ${registeredUser.username}! Account created as ${selectedRole.toUpperCase()}.`);
            
            if (selectedRole === 'owner') {
                return res.redirect("/dashboard/owner");
            }
            return res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", `Welcome back to StayWise AI, ${req.user.username}!`);
    const redirectUrl = res.locals.redirectUrl;
    if (redirectUrl && !redirectUrl.includes("/login") && !redirectUrl.includes("/signup")) {
        return res.redirect(redirectUrl);
    }
    
    if (req.user.role === 'admin') {
        return res.redirect("/dashboard/admin");
    } else if (req.user.role === 'owner') {
        return res.redirect("/dashboard/owner");
    }
    return res.redirect("/dashboard/student");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have successfully logged out.");
        res.redirect("/listings");
    });
};

module.exports.toggleWishlist = async (req, res) => {
    const { hostelId } = req.params;
    const user = await User.findById(req.user._id);
    
    const index = user.wishlist.indexOf(hostelId);
    let action = '';
    if (index > -1) {
        user.wishlist.splice(index, 1);
        action = 'removed';
    } else {
        user.wishlist.push(hostelId);
        action = 'added';
    }
    await user.save();
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({ success: true, action, wishlistCount: user.wishlist.length });
    }
    
    req.flash("success", `Hostel ${action} to your Wishlist!`);
    res.redirect("back");
};

module.exports.renderStudentDashboard = async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    const myBookings = await Booking.find({ student: req.user._id }).populate({
        path: "hostel",
        populate: { path: "owner" }
    }).sort({ createdAt: -1 });

    const Notification = require("../models/notification");
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);

    // AI recommended hostels for student
    let filter = { isApproved: true };
    if (user.collegeName) {
        filter.college = new RegExp(user.collegeName, "i");
    }
    const recommendedHostels = await Listing.find(filter).sort({ aiRecommendationScore: -1 }).limit(3);

    res.render("dashboard/student.ejs", {
        user,
        myBookings,
        notifications,
        recommendedHostels
    });
};

module.exports.renderOwnerDashboard = async (req, res) => {
    const myHostels = await Listing.find({ owner: req.user._id });
    const hostelIds = myHostels.map(h => h._id);

    const bookingRequests = await Booking.find({ hostel: { $in: hostelIds } })
        .populate("hostel student")
        .sort({ createdAt: -1 });

    const Notification = require("../models/notification");
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);

    // Compute owner stats
    const totalBeds = myHostels.reduce((sum, h) => sum + (h.availableBeds || 0), 0);
    const confirmedBookings = bookingRequests.filter(b => b.status === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    res.render("dashboard/owner.ejs", {
        myHostels,
        bookingRequests,
        notifications,
        stats: {
            totalProperties: myHostels.length,
            availableBeds: totalBeds,
            totalBookings: bookingRequests.length,
            totalRevenue
        }
    });
};