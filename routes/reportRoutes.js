const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { lastWeek, pending, closedTasks } = require("../controllers/reportController");

router.get("/last-week", protect, lastWeek);
router.get("/pending", protect, pending);
router.get("/closed-tasks", protect, closedTasks);

module.exports = router;