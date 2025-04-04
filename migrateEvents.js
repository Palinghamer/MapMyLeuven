// migrateEvents.js
require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/event'); // Adjust path if needed

async function migrateData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find all events with the old structure
        const events = await Event.find({
            "location.address": { $exists: true }
        });

        console.log(`Found ${events.length} events to migrate`);

        // Update each document
        for (const event of events) {
            await Event.updateOne(
                { _id: event._id },
                {
                    $set: {
                        address: event.location.address, // Move address to root
                        "location.type": "Point",        // Add GeoJSON type
                        "location.coordinates": event.location.coordinates
                    }
                }
            );
            console.log(`Migrated event: ${event._id}`);
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrateData();