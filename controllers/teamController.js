const Team = require("../models/Team");

const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Team.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Team already exists" });
    }

    const team = await Team.create({ name, description });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTeam, getTeams };