const router = require("express").Router();
const c = require("../controllers/volunteerController");

router.post("/register", c.registerVolunteer); // create profile
router.get("/:id", c.getVolunteer); // view profile
router.put("/:id", c.updateVolunteer); // edit details / toggle status
module.exports = router;
