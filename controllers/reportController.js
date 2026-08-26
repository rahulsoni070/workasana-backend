const Task = require("../models/Task");

const lastWeek = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tasks = await Task.find({
      status: "Completed",
      updatedAt: { $gte: sevenDaysAgo },
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const pending = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: "Completed" } });

    const totalDays = tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

    res.status(200).json({
      pendingTasks: tasks.length,
      totalDaysPending: totalDays,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const closedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "Completed" })
      .populate("team", "name")
      .populate("owners", "name");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { lastWeek, pending, closedTasks };