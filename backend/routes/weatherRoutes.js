const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const c = require("../controllers/weatherController");

// authMiddleware only has `protect` (JWT check), no role helper yet -
// gating admin-only here until we add a proper authorize() to authMiddleware.js
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

router.use(protect, requireAdmin);

router.get("/incidents", c.getIncidents); // dropdown source (mock for now)
router.post("/query", c.queryWeather); // hit Open-Meteo + log the result

module.exports = router;
