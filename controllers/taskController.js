const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { name, project, team, tags, dueDate, estimatedTime, status } = req.body;

    const task = await Task.create({
      name,
      project,
      team,
      tags,
      dueDate,
      estimatedTime,
      status,
      owners: [req.user.id], 
    });

    const populated = await Task.findById(task._id)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.team)    filter.team = req.query.team;
    if (req.query.owner)   filter.owners = req.query.owner;
    if (req.query.status)  filter.status = req.query.status;
    if (req.query.project) filter.project = req.query.project;
    if (req.query.tags)    filter.tags = req.query.tags;

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };