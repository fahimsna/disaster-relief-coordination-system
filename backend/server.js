require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const fundAllocationRoutes = require("./routes/fundAllocationRoutes");
const smsRoutes = require("./routes/smsRoutes");

const app = express();

// =====================================================
// SERVER CONFIG
// =====================================================

const PORT = process.env.PORT || 8000;

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://127.0.0.1:5173",

  // ===================================================
  // CURRENT VERCEL PRODUCTION DOMAIN
  // ===================================================
  "https://disaster-relief-coordination-system-steel.vercel.app",

  // ===================================================
  // OTHER VERCEL DOMAINS
  // ===================================================
  "https://disaster-relief-coordination-system.vercel.app",

  "https://disaster-relief-coordination-system-git-main-tasin7.vercel.app",

  "https://disaster-relief-coordination-system-five.vercel.app",

  "https://disaster-relief-coordination-system-7q4h91fe6-tasin7.vercel.app",

  "https://disaster-relief-coordination-system-bdvrdarga-tasin7.vercel.app",
];

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no Origin header.
      // This includes Postman, curl, and server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Allow registered frontend origins
      if (allowedOrigins.includes(origin)) {
        console.log("CORS allowed:", origin);
        return callback(null, true);
      }

      // Block unknown origins
      console.log("CORS blocked:", origin);

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],

    optionsSuccessStatus: 204,
  }),
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Disaster Relief Coordination System API is running",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// STRIPE WEBHOOK
// =====================================================

// Stripe requires the raw request body.
app.use(
  "/api/donations/webhook",
  express.raw({
    type: "application/json",
  }),
);

// =====================================================
// JSON BODY
// =====================================================

app.use(express.json());

// =====================================================
// API ROUTES
// =====================================================

// Reports
app.use("/api/reports", require("./routes/reportRoutes"));

// Volunteers
app.use("/api/volunteers", require("./routes/volunteerRoutes"));

// Severity thresholds
app.use("/api/thresholds", require("./routes/thresholdroutes"));

// Locations
app.use("/api/locations", require("./routes/locationRoutes"));

// Shelters
app.use("/api/shelters", require("./routes/shelterRoutes"));

// Analytics
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// Weather
app.use("/api/weather", require("./routes/weatherRoutes"));

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Campaigns
app.use("/api/campaigns", require("./routes/campaignRoutes"));

// Donations
app.use("/api/donations", require("./routes/donationRoutes"));

// Notifications
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Fund allocations
app.use("/api/fund-allocations", fundAllocationRoutes);

// SMS
app.use("/api/sms", smsRoutes);

// Stage updates
app.use("/api/stage-updates", require("./routes/stageRoutes"));

// Campaign analytics
app.use("/api/campaign-analytics", require("./routes/campaignAnalyticsRoutes"));

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// =====================================================
// DATABASE + SERVER
// =====================================================

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

startServer();
