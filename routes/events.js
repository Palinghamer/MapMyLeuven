const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/event');
const geocodeAddress = require('../utils/geocoder');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'event-images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: cloudinaryStorage });

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, date, time, location, price, category, description } = req.body;

        const coordinates = await geocodeAddress(location);

        if (!coordinates) {
            return res.status(400).json({ error: "Could not geocode the location. Please check the address." });
        }

        const newEvent = new Event({
            title,
            date,
            time,
            location: {
                address: location,
                coordinates: coordinates
            },
            price,
            category,
            description,
            imageUrl: req.file?.path || null
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Event creation error:', error);
        res.status(400).json({ error: error.message });
    }
});


router.get('/', async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const events = await Event.find(filter).sort('date');
        res.json({ events: events, selectedCategory: req.query.category });
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching event with ID:', req.params.id);
        const event = await Event.findById(req.params.id);
        if (!event) {
            console.warn('Event not found for ID:', req.params.id);
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
