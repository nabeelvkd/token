const mongoose = require('mongoose');

const daySchema = {
    enabled: { type: Boolean, default: false },
    intervals: [{
        start: { type: String, required: true },
        end: { type: String, required: true }
    }]
};

const workingHoursSchema = new mongoose.Schema({
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business',reqiured:true },
    Sunday: daySchema,
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema
},{ timestamps: true });

module.exports = mongoose.model('WorkingHours', workingHoursSchema);
