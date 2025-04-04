const axios = require('axios');

const geocodeAddress = async (address) => {
    try {
        // Using OpenStreetMap Nominatim (free)
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
        );

        if (!response.data || response.data.length === 0) {
            throw new Error('Address not found');
        }

        // Return [longitude, latitude]
        return [
            parseFloat(response.data[0].lon),
            parseFloat(response.data[0].lat)
        ];
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null; // Return null if geocoding fails
    }
};

module.exports = geocodeAddress;