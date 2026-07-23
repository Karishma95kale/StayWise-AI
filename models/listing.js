const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const Review =require("./review.js");

const listingSchema = new Schema({
    title: { 
        type: String,
        required: true, 
    },
    description: String,
    image: {
        filename: { type: String, default: "defaultimage" },
        url: { type: String, default: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80" }
    },
    images: [
        {
            filename: String,
            url: String
        }
    ],
    price: { type: Number, required: true }, // Monthly Rent
    securityDeposit: { type: Number, default: 0 },
    availableBeds: { type: Number, default: 1 },
    roomType: { 
        type: String, 
        enum: ['Single', 'Shared', 'PG', 'Flat', 'Double Sharing', 'Triple Sharing'],
        default: 'Single'
    },
    gender: { 
        type: String, 
        enum: ['Boys', 'Girls', 'Co-ed'],
        default: 'Co-ed'
    },
    college: { type: String, default: 'General Student Hub' },
    distanceFromCollege: { type: Number, default: 1.0 }, // km
    amenities: {
        type: [String],
        default: ['WiFi', 'Mess', 'Laundry', 'Power Backup']
    },
    messAvailable: { type: Boolean, default: true },
    messCharges: { type: Number, default: 0 },
    wifiAvailable: { type: Boolean, default: true },
    laundryAvailable: { type: Boolean, default: true },
    parkingAvailable: { type: Boolean, default: false },
    powerBackup: { type: Boolean, default: true },
    curfewTime: { type: String, default: '10:00 PM' },
    location: { type: String, required: true },
    country: { type: String, default: 'India' },
    latitude: { type: Number, default: 28.6139 },
    longitude: { type: Number, default: 77.2090 },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    safetyScore: { type: Number, default: 88, min: 0, max: 100 },
    aiRecommendationScore: { type: Number, default: 92, min: 0, max: 100 },
    isApproved: { type: Boolean, default: true },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

// if we delete listing then its all reviews should be deleted so use 
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({ _id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.models.Listing || mongoose.model("Listing", listingSchema);
module.exports = Listing;
