const express = require('express');
const mongoose = require('mongoose');
const Event = require('C:\\Users\\bauke\\WebstormProjects\\MapMyLeuven\\events.js'); // Import the Event model

const app = express();
const PORT = 3000;

// 🟢 Connect to MongoDB (make sure your .env has the correct URI)
require("dotenv").config(); // Load .env variables
mongoose.connect(process.env.MONGO_URI, );


// Middleware to parse JSON
app.use(express.json());

// 🟢 Add a new event
app.post('C:\\Users\\bauke\\WebstormProjects\\MapMyLeuven\\events.js', async (req, res) => {
    try {
        const { title, description, date, latitude, longitude, category } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            category
        });

        await newEvent.save();
        res.status(201).json({ message: "Event added!", event: newEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🟢 Fetch all events
app.get('C:\\Users\\bauke\\WebstormProjects\\MapMyLeuven\\events.js', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));