require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
<<<<<<< HEAD
=======
const fundAllocationRoutes = require("./routes/fundAllocationRoutes");
const smsRoutes = require("./routes/smsRoutes");
>>>>>>> c1e02908a29d0296f6cbf18d57b73cb99a8f6145

const app = express();

app.use(cors());

// Stripe webhook must receive the raw body
app.use("/api/donations/webhook", express.raw({ type: "application/json" }));

// All other routes use JSON
app.use(express.json());

// Routes
<<<<<<< HEAD
app.use('/api/reports', require('./routes/reportRoutes'));
=======
//app.use('/api/reports', require('./routes/reportRoutes'));
>>>>>>> c1e02908a29d0296f6cbf18d57b73cb99a8f6145
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use('/api/thresholds', require('./routes/thresholdRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
<<<<<<< HEAD
=======
app.use("/api/fund-allocations", fundAllocationRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/sms", smsRoutes);
>>>>>>> c1e02908a29d0296f6cbf18d57b73cb99a8f6145

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
