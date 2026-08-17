const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    // Stripe Checkout Session ID
    stripeSessionId: {
      type: String,
      default: "",
    },

    // Stripe Payment Intent ID
    transactionId: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "Stripe",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Donation", donationSchema);
