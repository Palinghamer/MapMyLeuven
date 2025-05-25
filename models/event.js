const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },  /
    time: { type: String },
    location: {
        address: { type: String, required: true },
        coordinates: {
            type: [Number],
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


EventSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model('Event', EventSchema);
