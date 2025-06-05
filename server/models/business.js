const mongoose = require('mongoose');

const locationSchema = {
  latitude: Number,
  longitude: Number
};

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: Number,
  password: String,
  category: String,
  subCategory: String, 
  location: locationSchema,
  address: String,
},{ timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
