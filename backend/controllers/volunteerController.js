const Volunteer = require("../models/Volunteer");

// POST /api/volunteers/register
// Runs once, right after the OCR wizard's confirm screen. req.user comes
// from authMiddleware (full User doc minus password), so we grab req.user._id.
exports.registerVolunteer = async (req, res) => {
  try {
    const existing = await Volunteer.findOne({ user: req.user._id });
    if (existing) {
      // stop someone from double-submitting the wizard and creating dupes
      return res
        .status(400)
        .json({
          error:
            "You already have a volunteer profile. Use the edit form instead.",
        });
    }

    const volunteer = await Volunteer.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/volunteers/profile
// "Get MY profile" -- no :id, we scope everything off the logged-in user
exports.getProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id });
    if (!volunteer) {
      return res
        .status(404)
        .json({
          error:
            "No volunteer profile yet -- finish the registration wizard first.",
        });
    }
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/volunteers/profile
// Edit form on the profile panel saves here.
exports.updateProfile = async (req, res) => {
  try {
    // strip user/status out of the body -- user can't be reassigned, and
    // status only changes via the dedicated toggle route below
    const { user, status, ...safeUpdates } = req.body;

    const volunteer = await Volunteer.findOneAndUpdate(
      { user: req.user._id },
      safeUpdates,
      { new: true, runValidators: true },
    );
    if (!volunteer)
      return res.status(404).json({ error: "No volunteer profile yet." });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/volunteers/profile/toggle-availability
// Just flips available <-> unavailable, that's it.
exports.toggleAvailability = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id });
    if (!volunteer)
      return res.status(404).json({ error: "No volunteer profile yet." });

    volunteer.status =
      volunteer.status === "available" ? "unavailable" : "available";
    await volunteer.save();
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
