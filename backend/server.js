require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary test route (remove later)
app.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({
    message: "Express is working",
  });
});

// Routes
app.use("/api/volunteers", require("./routes/volunteerRoutes"));
app.use("/api/weather", require("./routes/weatherRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/test", require("./routes/testRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 8000, () =>
      console.log(`Server running on port ${process.env.PORT || 8000}`),
    );
  })
  .catch((err) => console.error("DB connection error:", err));
