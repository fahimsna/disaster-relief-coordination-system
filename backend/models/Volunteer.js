const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    idNumber: { type: String, required: true }, // from NID/Student ID
    phone: { type: String, required: true },
    district: { type: String, required: true },
    bloodType: { type: String },
    skills: [{ type: String }], // e.g. ["First Aid", "Search & Rescue"]
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
