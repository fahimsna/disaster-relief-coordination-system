const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    // links this profile back to the account that owns it -- added this so
    // authMiddleware's req.user._id can find "my" profile without an :id param
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one volunteer profile per account, no duplicates
    },
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
    // mission history isn't a real model/collection yet -- profile panel
    // just mocks this on the frontend for now (src/data/mockMissions.js)
  },
  { timestamps: true },
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
