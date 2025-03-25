const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    location: {
        type: { type: String, default: "Point" },
        coordinates: [Number] // [longitude, latitude]
    },
    category: String // e.g., "Music", "Sports", "Food"
});

// Create a 2dsphere index for geolocation queries
eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;