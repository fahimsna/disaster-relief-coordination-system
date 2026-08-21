require("dotenv").config();

const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const fundAllocationRoutes = require("./routes/fundAllocationRoutes");
const smsRoutes = require("./routes/smsRoutes");

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",

  // Current Vercel production/preview domains
  "https://disaster-relief-coordination-system-five.vercel.app",
  "https://disaster-relief-coordination-system-git-main-tasin7.vercel.app",
  "https://disaster-relief-coordination-system-7q4h91fe6-tasin7.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// =====================================================
// STRIPE WEBHOOK
// =====================================================

// Stripe webhook must receive the raw body
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
// ROUTES
// =====================================================

app.use("/api/reports", require("./routes/reportRoutes"));

app.use("/api/volunteers", require("./routes/volunteerRoutes"));

app.use("/api/thresholds", require("./routes/thresholdroutes"));

app.use("/api/locations", require("./routes/locationRoutes"));

app.use("/api/shelters", require("./routes/shelterRoutes"));

app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use("/api/weather", require("./routes/weatherRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/campaigns", require("./routes/campaignRoutes"));

app.use("/api/donations", require("./routes/donationRoutes"));

app.use("/api/fund-allocations", fundAllocationRoutes);

app.use("/api/notifications", require("./routes/notificationRoutes"));

app.use("/api/sms", smsRoutes);

app.use("/api/stage-updates", require("./routes/stageRoutes"));

// =====================================================
// CAMPAIGN ANALYTICS
// =====================================================

app.use("/api/campaign-analytics", require("./routes/campaignAnalyticsRoutes"));

// =====================================================
// DATABASE CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
