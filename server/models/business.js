const mongoose = require('mongoose');
const axios = require('axios');

const locationSchema = {
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
};

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  password: { type: String },
  category: { type: String },
  subCategory: { type: String },
  location: locationSchema,
  address: { type: String },
  locality: { type: String },  // Store locality
  city: { type: String },      // Store city
}, { timestamps: true });

// Reverse Geocoding function (using Nominatim)
const reverseGeocode = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await axios.get(url);
    const address = response.data.address;
    console.log(address)

    // Extract locality and city
    const locality = address.hamlet || address.town || address.suburb || address.road|| 'Unknown Locality';
    const city = address.city || address.county || address.state_district || 'Unknown City';

    return { locality, city };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return { locality: 'Unknown Locality', city: 'Unknown City' };  // Default values
  }
};

// Pre-save hook to reverse geocode before saving
businessSchema.pre('save', async function (next) {
  const business = this;

  // Only perform reverse geocoding if latitude and longitude exist
  if (business.location.latitude && business.location.longitude) {
    const { locality, city } = await reverseGeocode(business.location.latitude, business.location.longitude);

    // Set locality and city fields
    business.locality = locality;
    business.city = city;
  }

  // Continue with the save operation
  next();
});

module.exports = mongoose.model('Business', businessSchema);
