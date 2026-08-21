const mongoose = require("mongoose");

const stageUpdateSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DisasterReport",
      required: true,
    },
    stage: {
      type: String,
      enum: ["Dispatched", "In Transit", "On Site", "Distributed"],
      required: true,
    },
    note: { type: String, required: true, trim: true },
    // optional -- stored as a data URI for now, no upload middleware yet
    photoUrl: { type: String },
  },
  { timestamps: true },
);

// admin feed reads this newest-first
stageUpdateSchema.index({ createdAt: -1 });

module.exports = mongoose.model("StageUpdate", stageUpdateSchema);
