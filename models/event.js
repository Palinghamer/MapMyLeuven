const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    time: String,
    location: {
        address: String,
        coordinates: {
            type: [Number] // [longitude, latitude]
        }
    },
    price: String,
    description: String,
    imageUrl: String
}, { timestamps: true });

// ✅ Define the geospatial index just once here
EventSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Event', EventSchema);
