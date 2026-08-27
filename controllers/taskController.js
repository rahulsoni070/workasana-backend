const Task = require("../models/Task");
const Tag = require("../models/Tag");

const saveTags = async (tags) => {
  if (!tags || !tags.length) return;
  await Promise.all(
    tags.map((name) =>
      Tag.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true })
    )
  );
};

const populateTask = (query) =>
  query
    .populate("project", "name")
    .populate("team", "name")
    .populate("owners", "name email");

const createTask = async (req, res) => {
  try {
    const { name, project, team, tags, dueDate, estimatedTime, status, owners } = req.body;

    await saveTags(tags);

    const task = await Task.create({
      name,
      project,
      team,
      tags,
      dueDate,
      estimatedTime,
      status,
      owners: owners && owners.length ? owners : [req.user.id],
    });

    const populated = await populateTask(Task.findById(task._id));

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

    const tasks = await populateTask(Task.find(filter));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await populateTask(Task.findById(req.params.id));
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const allowed = ["name", "project", "team", "tags", "dueDate", "estimatedTime", "status", "owners"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    await saveTags(updates.tags);

    const updatedTask = await populateTask(
      Task.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
      })
    );

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

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };