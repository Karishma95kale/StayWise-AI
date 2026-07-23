const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    hostel: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roomType: {
        type: String,
        enum: ['Single', 'Shared', 'PG', 'Flat', 'Double Sharing', 'Triple Sharing'],
        required: true
    },
    moveInDate: {
        type: Date,
        required: true
    },
    durationMonths: {
        type: Number,
        default: 11,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
