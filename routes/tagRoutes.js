const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createTag, getTags } = require("../controllers/tagController");
router.post("/", protect, createTag);
router.get("/", protect, getTags);
module.exports = router;