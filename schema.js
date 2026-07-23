const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi.object({
    title: joi.string().required(),
    description: joi.string().allow("", null),
    location: joi.string().required(),
    country: joi.string().allow("", null).default("India"),
    price: joi.number().required().min(0),
    securityDeposit: joi.number().min(0).allow("", null),
    availableBeds: joi.number().min(1).allow("", null),
    roomType: joi.string().valid('Single', 'Shared', 'PG', 'Flat', 'Double Sharing', 'Triple Sharing').allow("", null),
    gender: joi.string().valid('Boys', 'Girls', 'Co-ed').allow("", null),
    college: joi.string().allow("", null),
    distanceFromCollege: joi.number().min(0).allow("", null),
    amenities: joi.array().items(joi.string()).allow(null),
    messAvailable: joi.boolean().allow(null),
    messCharges: joi.number().min(0).allow("", null),
    wifiAvailable: joi.boolean().allow(null),
    laundryAvailable: joi.boolean().allow(null),
    parkingAvailable: joi.boolean().allow(null),
    powerBackup: joi.boolean().allow(null),
    curfewTime: joi.string().allow("", null),
    latitude: joi.number().allow("", null),
    longitude: joi.number().allow("", null),
    image: joi.object({
      url: joi.string().allow("", null),
      filename: joi.string().allow("", null)
    }).allow(null)
  }).required()
});

module.exports.reviewSchema = joi.object({
  review: joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required(),
  }).required(),
});

module.exports.bookingSchema = joi.object({
  booking: joi.object({
    hostelId: joi.string().required(),
    roomType: joi.string().required(),
    moveInDate: joi.date().required(),
    durationMonths: joi.number().min(1).max(36).default(11),
    specialRequests: joi.string().allow("", null)
  }).required()
});