const mongoose = require('mongoose');

// Define the sub-schema for supplies
const supplySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'Drinking Water',
      'Dry Food / Rations',
      'Medical Supplies / First Aid',
      'Baby Food & Formula',
      'Blankets & Bedding',
      'Sanitation & Hygiene Kits',
      'Emergency Power / Fuel',
      'Other'
    ]
  },
  status: {
    type: String,
    required: true,
    enum: ['CRITICAL', 'LOW', 'ADEQUATE'],
    default: 'ADEQUATE'
  },
  quantityNeeded: {
    type: String, // String prevents crashing on empty inputs and allows units (e.g. "50 kg")
    trim: true,
    default: ""
  }
}, { _id: false });

// Define the main Shelter schema
const shelterSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Shelter name is required'],
    trim: true
  },
  shelterCode: { 
    type: String,
    trim: true
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true
  },
  division: { 
    type: String,
    trim: true
  },
  district: { 
    type: String, 
    required: [true, 'District is required'],
    trim: true
  },
  latitude: { 
    type: Number, 
    required: [true, 'Latitude is required'] 
  },
  longitude: { 
    type: Number, 
    required: [true, 'Longitude is required'] 
  },
  managerName: {
    type: String,
    trim: true,
    default: ''
  },
  contactPhone: {
    type: String,
    trim: true,
    default: ''
  },
  emergencyAltPhone: {
    type: String,
    trim: true,
    default: ''
  },
  occupantCount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  capacity: { 
    type: Number, 
    required: [true, 'Capacity is required'],
    min: 1 
  },
  criticalSupplies: [supplySchema],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Shelter', shelterSchema);