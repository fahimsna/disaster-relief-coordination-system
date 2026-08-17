// backend/models/Location.js
const mongoose = require('mongoose');

// Schema for individual Districts and their Upazilas/Subdistricts
const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  subdistricts: [
    {
      type: String,
      trim: true
    }
  ]
}, { _id: false }); // Disable automatic _id for subdocuments if not needed

// Schema for Divisions
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Division Name (e.g., "Dhaka", "Khulna")
      required: true,
      unique: true,
      trim: true
    },
    districts: [districtSchema]
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model('Location', locationSchema);