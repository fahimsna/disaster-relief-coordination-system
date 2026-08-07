const router = require("express").Router();
const { protect: auth } = require("../middleware/authMiddleware");
const c = require("../controllers/volunteerController");

router.post("/register", auth, c.registerVolunteer); // create my profile (once)
router.get("/profile", auth, c.getProfile); // view my profile
router.put("/profile", auth, c.updateProfile); // edit my details
router.patch("/profile/toggle-availability", auth, c.toggleAvailability); // flip status

module.exports = router;
