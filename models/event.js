const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: String,
    date: String,
    location: String,
    description: String,
    price: Number,
    coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }
    }
});

module.exports = mongoose.model("event", EventSchema);
