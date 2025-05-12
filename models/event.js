const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },  // Or Date if you’re combining date+time
    time: { type: String },
    location: {
        address: { type: String, required: true },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
    price: { type: String },
    category: {
        type: String,
        enum: [
            'music',
            'lecture',
            'sport',
            'food',
            'art',
            'workshop',
            'community',
            'festival'
        ],
        required: true
    },
    description: { type: String },
    imageUrl: { type: String }
}, { timestamps: true });

// ✅ Define the geospatial index just once here
EventSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Event', EventSchema);
