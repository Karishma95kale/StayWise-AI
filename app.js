if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const methodOverride = require("method-override");
const app = express();

// Trust reverse proxy (e.g. Render / Heroku / Nginx) for secure cookies
app.set("trust proxy", 1);

const mongoose = require("mongoose");

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

const { listingSchema, reviewSchema } = require("./schema.js");

const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listings.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const adminRouter = require("./routes/admin.js");
const aiRouter = require("./routes/ai.js");
const compareRouter = require("./routes/compare.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* ================= DATABASE ================= */

const dbUrl =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staywise";

const secret =
    process.env.SECRET || "mysupersecretcode";

main()
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

/* ================= SESSION ================= */

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Mongo Session Store Error", err);
});

const isProductionCloud = process.env.NODE_ENV === "production" && !dbUrl.includes("127.0.0.1") && !dbUrl.includes("localhost");

const sessionOption = {
    store,
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProductionCloud,
        sameSite: "lax",
    },
};

app.use(session(sessionOption));

/* ================= PASSPORT ================= */

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    res.locals.currentUser = req.user;
    next();
});

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/admin", adminRouter);
app.use("/ai", aiRouter);
app.use("/compare", compareRouter);
app.use("/", userRouter);

app.get("/error", (req, res) => {
    const { message = "Something went wrong" } = req.query;
    res.render("error", { message });
});

/* ================= LOGGER ================= */

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
});