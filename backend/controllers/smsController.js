const Notification = require("../models/Notification");
const Volunteer = require("../models/Volunteer");

// Check if Twilio is available (for production)
let twilio = null;
let useMock = true; // Default to mock mode

try {
  // Only try to load twilio if credentials exist
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilio = require("twilio");
    useMock = false;
    console.log("✅ Twilio loaded successfully - Production mode");
  } else {
    console.log("⚠️ Twilio credentials not found - Using MOCK mode");
  }
} catch (error) {
  console.log("⚠️ Twilio not installed or error loading - Using MOCK mode");
  console.log("   To use real SMS: npm install twilio and add credentials to .env");
}

// =========================================================
// SEND SMS BROADCAST
// =========================================================
// @desc Send SMS broadcast to volunteers in a district
// @route POST /api/sms/broadcast
// @access Admin only
exports.sendBroadcast = async (req, res) => {
  try {
    const { notificationId, messageBody, district, severity } = req.body;

    // Validation
    if (!messageBody || !district) {
      return res.status(400).json({
        success: false,
        message: "Message body and district are required",
      });
    }

    // Add severity to message if provided
    const fullMessage = severity ? `[${severity}] ${messageBody}` : messageBody;

    // 1. Find the notification draft (if notificationId provided)
    let notification = null;
    if (notificationId) {
      notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification draft not found",
        });
      }
    }

    // 2. Get all volunteers in the district
    const volunteers = await Volunteer.find({ district: district });
    
    if (volunteers.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No volunteers found in ${district}`,
      });
    }

    // 3. Extract phone numbers
    const phoneNumbers = volunteers
      .map(v => v.phone)
      .filter(phone => phone && phone.length > 0);

    if (phoneNumbers.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No valid phone numbers found in ${district}`,
      });
    }

    // 4. Send SMS to each volunteer
    const deliveryResults = [];
    const mockMode = useMock || !twilio;

    for (const phone of phoneNumbers) {
      try {
        let result;

        if (mockMode) {
          // MOCK MODE - Simulate successful send
          console.log(`📱 [MOCK] Sending SMS to ${phone}: ${fullMessage}`);
          result = {
            success: true,
            messageSid: `SM${Date.now()}${Math.random().toString(36).substring(7)}`,
            status: "sent",
            phoneNumber: phone,
          };
        } else {
          // REAL TWILIO - Send actual SMS
          const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
          );
          
          const message = await client.messages.create({
            body: fullMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
          });

          result = {
            success: true,
            messageSid: message.sid,
            status: message.status || "sent",
            phoneNumber: phone,
          };
        }

        deliveryResults.push({
          phoneNumber: phone,
          messageSid: result.messageSid,
          status: result.status,
          timestamp: new Date(),
        });

      } catch (error) {
        console.error(`Failed to send SMS to ${phone}:`, error.message);
        deliveryResults.push({
          phoneNumber: phone,
          status: "failed",
          errorMessage: error.message,
          timestamp: new Date(),
        });
      }
    }

    // 5. Count results
    const sentCount = deliveryResults.filter(r => r.status === "sent" || r.status === "queued").length;
    const failedCount = deliveryResults.filter(r => r.status === "failed").length;
    const totalCount = deliveryResults.length;

    // 6. Save delivery logs to notification (if notificationId provided)
    if (notification) {
      notification.deliveryLog = deliveryResults;
      notification.sentBy = req.user._id;

      // Determine final status based on results
      if (failedCount === totalCount) {
        notification.status = "failed";  // All failed
      } else {
        notification.status = "sent";    // At least some sent
        notification.sentAt = new Date(); // Set sent time
      }

      await notification.save();
    }

    // 7. Return response
    res.status(200).json({
      success: true,
      message: `Broadcast sent to ${sentCount} volunteers (${failedCount} failed)`,
      data: {
        district: district,
        totalVolunteers: totalCount,
        sentCount: sentCount,
        failedCount: failedCount,
        deliveryLog: deliveryResults,
        notificationId: notification ? notification._id : null,
        mockMode: mockMode,
      },
    });

  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send broadcast",
    });
  }
};

// =========================================================
// GET SMS DELIVERY LOGS
// =========================================================
// @desc Get all SMS delivery logs
// @route GET /api/sms/logs
// @access Admin only
exports.getSMSLogs = async (req, res) => {
  try {
    const { district, status } = req.query;
    
    // Build filter
    const filter = { status: "sent" };
    if (district) filter.district = district;
    
    const logs = await Notification.find(filter)
      .populate("createdBy", "name email")
      .populate("sentBy", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================
// GET SINGLE SMS LOG
// =========================================================
// @desc Get SMS delivery log by ID
// @route GET /api/sms/logs/:id
// @access Admin only
exports.getSMSLogById = async (req, res) => {
  try {
    const log = await Notification.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("sentBy", "name email");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found",
      });
    }

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================
// GET VOLUNTEERS BY DISTRICT (for preview)
// =========================================================
// @desc Get volunteers count by district
// @route GET /api/sms/volunteers/:district
// @access Admin only
exports.getVolunteersByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    
    const volunteers = await Volunteer.find({ district: district })
      .select("fullName phone district status")
      .limit(50);

    const totalCount = await Volunteer.countDocuments({ district: district });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      total: totalCount,
      data: volunteers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};