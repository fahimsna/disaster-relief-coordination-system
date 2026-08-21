const mongoose = require("mongoose");

const fundAllocationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Medical",
        "Shelter",
        "Clothing",
        "Transportation",
        "Other",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    description: {
      type: String,
      trim: true,
    },

    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("FundAllocation", fundAllocationSchema);
