const router = require("express").Router();
const { protect: auth } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/stageController");

router.get("/mine", auth, c.getMyMission); // my active mission + its history
router.post("/", auth, c.submitStage); // log the next sequential stage
router.get("/feed", auth, admin, c.getFeed); // admin consolidated feed
router.get("/history", auth, c.getHistory); // volunteer's completed missions

module.exports = router;
