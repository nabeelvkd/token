const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business', // or 'User', depending on your model
        required: true
    },
    tokenName: {
        type: String,
        required: true
    },
    services: [
        {
            type: String,
            required: true
        }
    ],
    assignedMembers: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Change 'User' to your actual member model name
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],
    daySessionPairs: [
        {
            day: {
                type: String,
                enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                required: true
            },
            session: {
                type: String,
                required: true
            }
        }
    ],
    maxTokensPerSession: {
        type: Number,
        required: true
    },
    bookingMinutesBefore: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    tokensBooked: {
        type: Number,
        default: 0
    },
    currentToken:{
        type:Number,
        default:0,
    }
});

module.exports = mongoose.model('Token', TokenSchema);
