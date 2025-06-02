const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  contactEmail: String,
  contactPhone: String,
  address: String,
  location: {
    type: {
      type: String,       // must be 'Point'
      enum: ['Point'],    
      required: true
    },
    coordinates: {
      type: [Number],     // [longitude, latitude]
      required: true
    }
  },
  createdAt: { type: Date, default: Date.now },
});

// Create 2dsphere index for location queries
BusinessSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Business', BusinessSchema);
