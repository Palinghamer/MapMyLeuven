const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/event');
const geocodeAddress = require('../utils/geocoder');
console.log('Geocode function:', typeof geocodeAddress);// Import the function

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Ensure this path exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, date, time, location, price, description } = req.body;

        console.log("📦 Form data received:", req.body);
        console.log("🖼 File received:", req.file);

        // Step 1: Geocode the address
        const coordinates = await geocodeAddress(location);

        // Step 2: If geocoding failed, abort
        if (!coordinates) {
            return res.status(400).json({ error: "Could not geocode the location. Please check the address." });
        }

        // Step 3: Create the new event with correct location object
        const newEvent = new Event({
            title,
            date,
            time,
            location: {
                address: location,
                coordinates: coordinates
            },
            price,
            description,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null

        });

        // Step 4: Save and respond
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('❌ Event creation error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;