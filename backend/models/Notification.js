const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    messageBody: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1600, 'Message body cannot exceed 1600 characters'],
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["Advisory", "Warning", "Critical"],
      required: true,
    },

    targetGroups: {
      type: [String],
      enum: ["Volunteers", "Donors", "All"],
      required: true,
      validate: {
        validator: function(groups) {
          return groups.length > 0;
        },
        message: 'Please select at least one target group',
      },
    },

    status: {
      type: String,
      enum: ["draft", "sent", "failed", "cancelled"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    sentAt: {
      type: Date,
    },

    // Delivery logs for SMS
    deliveryLog: [
      {
        phoneNumber: {
          type: String,
          required: true,
        },
        messageSid: {
          type: String,
        },
        status: {
          type: String,
          enum: ["queued", "sent", "delivered", "failed", "pending"],
          default: "pending",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        errorMessage: {
          type: String,
        },
      },
    ],

    // Track who sent the SMS
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);