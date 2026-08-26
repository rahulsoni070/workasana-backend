const Tag = require("../models/Tag");

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Tag.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Tag already exists" });
    }
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTag, getTags };