const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Project.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Project already exists" });
    }
    const project = await Project.create({ name, description });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createProject, getProjects };