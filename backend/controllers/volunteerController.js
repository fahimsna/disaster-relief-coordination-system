const Volunteer = require("../models/Volunteer");
const DisasterReport = require("../models/disasterReport");

// POST /api/volunteers/register
// Runs once, right after the OCR wizard's confirm screen. req.user comes
// from authMiddleware (full User doc minus password), so we grab req.user._id.
exports.registerVolunteer = async (req, res) => {
  try {
    const existing = await Volunteer.findOne({ user: req.user._id });
    if (existing) {
      // stop someone from double-submitting the wizard and creating dupes
      return res.status(400).json({
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
exports.getProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ user: req.user._id });
    if (!volunteer) {
      return res.status(404).json({
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

// TASK ASSIGNMENT BOARD -- admin-only, see routes

// GET /api/volunteers/board
// One call, three buckets -- avoids the board firing 3 separate fetches.
exports.getBoard = async (req, res) => {
  try {
    const incidentFields = "crisisType district subdistrict severity status";
    const [available, assigned, deployed] = await Promise.all([
      Volunteer.find({
        status: "available",
        assignmentStage: { $nin: ["assigned", "deployed"] }, // catches "none" AND legacy docs missing the field entirely
      }).sort({ fullName: 1 }),
      Volunteer.find({ assignmentStage: "assigned" })
        .populate("assignedIncident", incidentFields)
        .sort({ updatedAt: -1 }),
      Volunteer.find({ assignmentStage: "deployed" })
        .populate("assignedIncident", incidentFields)
        .sort({ updatedAt: -1 }),
    ]);
    res.json({ success: true, data: { available, assigned, deployed } });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load task board", error: err.message });
  }
};

// PATCH /api/volunteers/:id/assign  { incidentId }
// Available -> Assigned. Flips status to "unavailable" so the volunteer drops
// out of the available pool immediately -- prevents double dispatch per spec.
exports.assignVolunteer = async (req, res) => {
  try {
    const { incidentId } = req.body;
    if (!incidentId) {
      return res.status(400).json({ message: "incidentId is required." });
    }

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer)
      return res.status(404).json({ message: "Volunteer not found." });

    if (
      volunteer.status !== "available" ||
      volunteer.assignmentStage !== "none"
    ) {
      return res
        .status(409)
        .json({ message: "Volunteer is not available for assignment." });
    }

    const incident = await DisasterReport.findById(incidentId);
    if (!incident)
      return res.status(404).json({ message: "Incident not found." });

    // case-insensitive -- see note on the verifyReport casing bug in reportController
    if (!/^verified$/i.test(incident.status)) {
      return res.status(400).json({
        message: "Only verified incidents can receive volunteer assignments.",
      });
    }

    volunteer.status = "unavailable";
    volunteer.assignedIncident = incident._id;
    volunteer.assignmentStage = "assigned";
    await volunteer.save();

    const populated = await volunteer.populate(
      "assignedIncident",
      "crisisType district subdistrict severity status",
    );
    res.json({ success: true, message: "Volunteer assigned", data: populated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to assign volunteer", error: err.message });
  }
};

// PATCH /api/volunteers/:id/deploy
// Assigned -> Deployed. (Full Dispatched->...->Distributed flow lands with the
// Relief Distribution Stage Tracker feature -- this is just the board's manual flag.)
exports.markDeployed = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer)
      return res.status(404).json({ message: "Volunteer not found." });

    if (volunteer.assignmentStage !== "assigned") {
      return res.status(409).json({
        message: "Volunteer must be Assigned before they can be Deployed.",
      });
    }

    volunteer.assignmentStage = "deployed";
    await volunteer.save();

    const populated = await volunteer.populate(
      "assignedIncident",
      "crisisType district subdistrict severity status",
    );
    res.json({
      success: true,
      message: "Volunteer marked as deployed",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update deployment status",
      error: err.message,
    });
  }
};

// PATCH /api/volunteers/:id/unassign
// Escape hatch for dispatch mistakes / early mission end -- not in the spec,
// but cheap to add so a volunteer never gets stranded in Assigned/Deployed
// with no way back before the stage tracker feature exists.
exports.unassignVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer)
      return res.status(404).json({ message: "Volunteer not found." });

    if (volunteer.assignmentStage === "none") {
      return res
        .status(400)
        .json({ message: "Volunteer is already unassigned." });
    }

    volunteer.status = "available";
    volunteer.assignedIncident = null;
    volunteer.assignmentStage = "none";
    volunteer.deliveryStage = null; // clear any in-progress stage tracker state too
    await volunteer.save();

    res.json({
      success: true,
      message: "Volunteer released back to available pool",
      data: volunteer,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to release volunteer", error: err.message });
  }
};
