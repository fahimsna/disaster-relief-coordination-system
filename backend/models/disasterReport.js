const mongoose = require('mongoose');

const DisasterReportSchema = new mongoose.Schema({
    crisisType: { 
        type: String, 
        required: true, 
        enum: ['Flood', 'Cyclone', 'Earthquake', 'Other'] 
    },
    description: { type: String, required: true },
    latitude: { type: Number }, 
    longitude: { type: Number },
    manualAddress: { type: String }, 
    subdistrict: { type: String, required: true }, 
    district: { type: String, required: true }, 
    status: { 
        type: String, 
        default: 'unverified', 
        enum: ['unverified', 'verified', 'rejected', 'resolved']
    },
    severity: { 
        type: String, 
        default: 'Low', 
        enum: ['Low', 'Medium', 'Critical'] 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DisasterReport', DisasterReportSchema);