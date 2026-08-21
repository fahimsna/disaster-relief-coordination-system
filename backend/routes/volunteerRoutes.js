const router = require("express").Router();
const { protect: auth } = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const c = require("../controllers/volunteerController");

router.post("/register", auth, c.registerVolunteer); // create my profile (once)
router.get("/profile", auth, c.getProfile); // view my profile
router.put("/profile", auth, c.updateProfile); // edit my details
router.patch("/profile/toggle-availability", auth, c.toggleAvailability); // flip status

// -- Task Assignment Board, admin only --
router.get("/board", auth, admin, c.getBoard); // available/assigned/deployed buckets
router.patch("/:id/assign", auth, admin, c.assignVolunteer); // Available -> Assigned
router.patch("/:id/deploy", auth, admin, c.markDeployed); // Assigned -> Deployed
router.patch("/:id/unassign", auth, admin, c.unassignVolunteer); // release back to Available

module.exports = router;
