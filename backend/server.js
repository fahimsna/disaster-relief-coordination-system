require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());

// Stripe webhook must receive the raw body
app.use("/api/donations/webhook", express.raw({ type: "application/json" }));

// All other routes use JSON
app.use(express.json());

// Routes
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/campaigns", require("./routes/campaignRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));

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
