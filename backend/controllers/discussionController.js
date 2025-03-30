const Discussion = require("../models/Discussion");

exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().populate("author", "name").sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    // Convert tags to an array if provided as comma-separated string
    const tagsArray =
      tags && typeof tags === "string"
        ? tags.split(",").map(tag => tag.trim())
        : Array.isArray(tags) ? tags : [];
    
    const newDiscussion = new Discussion({
      title,
      content,
      category,
      tags: tagsArray,
      author: req.user._id,
      voteRecords: [],
    });
    const discussion = await newDiscussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.voteDiscussion = async (req, res) => {
  try {
    const { vote } = req.body; // "up" or "down"
    if (!["up", "down"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }
    const userId = req.user._id;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });
    const voteValue = vote === "up" ? 1 : -1;
    const existingIndex = discussion.voteRecords.findIndex(record => record.user.toString() === userId.toString());
    if (existingIndex > -1) {
      // Toggle off if same vote; otherwise update vote
      if (discussion.voteRecords[existingIndex].vote === voteValue) {
        discussion.voteRecords.splice(existingIndex, 1);
      } else {
        discussion.voteRecords[existingIndex].vote = voteValue;
      }
    } else {
      discussion.voteRecords.push({ user: userId, vote: voteValue });
    }
    discussion.votes = discussion.voteRecords.reduce((sum, record) => sum + record.vote, 0);
    await discussion.save();
    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
