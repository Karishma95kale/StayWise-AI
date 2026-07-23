

if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}


const express=require("express");
const methodOverride = require("method-override");
const app=express();
const mongoose=require("mongoose");

const Listing=require("./models/listing.js");
const  Review=require("./models/review.js");
const  User=require("./models/user.js");

const passport=require("passport");
const LocalStrategy =require("passport-local");


const session=require("express-session");
const flash=require("connect-flash");


const MongoStore = require('connect-mongo');

//const Listing=require("./models/listing.js");
//const Listing = require(path.join(dirname, "../models/listing"))

//const ejsMate=require("ejs-mate");

const { listingSchema,reviewSchema}=require("./schema.js");

const path=require("path");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
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

const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/staywise";

main()
  .then(() => {
    console.log(" Connected to MongoDB");
  })
  .catch(err => {
    console.error("Connection error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "mysupersecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("error in mongo session store", err);
});

const sessionOption = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(session(sessionOption));
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

// Root Route Redirect to Listings Explore Page
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

//const mongo_url="mongodb://127.0.0.1:27017/wanderlust";







app.get("/error", (req, res) => {
  const { message = "Something went wrong" } = req.query;
  res.render("error", { message });
});





/*app.get("/testlisting", async(req,res)=>{
  let sample_listing=new Listing({
    title:"my new villa",
    description:"by the beach",
    price:1200,
    location:"calangute,goa",
    country:"india",
  });
  await sample_listing.save();
  console.log("sample was saved");
  res.send("successful testing");
});*/

/*app.get("/",(req,res)=>{
    res.send("hi i am root");
});*/

/*app.all("/",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});/
// use this instead of this : so server not get crash
/app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});*/
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});



app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error", { message });
});

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
});