const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createTeam, getTeams } = require("../controllers/teamController");

router.post("/", protect, createTeam);
router.get("/", protect, getTeams); 

module.exports = router;