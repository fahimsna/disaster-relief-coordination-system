const Volunteer = require("../models/Volunteer");

exports.registerVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ error: "Not found" });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!volunteer) return res.status(404).json({ error: "Not found" });
    res.json(volunteer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
