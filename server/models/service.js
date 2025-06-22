const mongoose = require('mongoose');

const singleServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tokenId:{type:mongoose.Schema.Types.ObjectId,default:null},
  estimatedTime: { type: Number, required: true }, // in minutes
  fee: { type: Number, required: true }
}, { _id: false });

const serviceGroupSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    unique: true // 1 service doc per business
  },
  services: [singleServiceSchema]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceGroupSchema);
