const mongoose = require('mongoose');

const tokenQueueSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  tokenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    required: true,
    index: true
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    index:true
  },
  queueNumber: {
    type: Number,
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'completed', 'cancelled'],
    default: 'waiting',
    index: true
  },
  issueTime: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index to quickly find last token for a business & token
tokenQueueSchema.index({ tokenId: 1, queueNumber: -1 });

// Compound index for efficient filtering by business, token, and status
tokenQueueSchema.index({ businessId: 1, tokenId: 1, status: 1 });


module.exports = mongoose.model('TokenQueue', tokenQueueSchema);
