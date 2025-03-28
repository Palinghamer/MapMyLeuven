const express = require("express");
const Event = require("../models/event.js");

const router = express.Router();

// Add new event
router.post("/", async (req, res) => {
    const newEvent = new Event({
        ...req.body,
        coordinates: { type: "Point", coordinates: [req.body.longitude, req.body.latitude] }
    });

    await newEvent.save();
    res.json({ message: "Event added!" });
});

// Get all events
router.get("/", async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

module.exports = router;
