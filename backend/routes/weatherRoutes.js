const router = require("express").Router();
const c = require("../controllers/weatherController");

router.post("/check", c.checkWeather); // query live weather + save log
router.get("/logs", c.getLogs); // history of all queries
router.get("/logs/:id", c.getLogById); // single log
module.exports = router;
