const Discussion = require("../models/Discussion");

// GET all discussions
exports.getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vote on a discussion (upvote or downvote)
exports.voteDiscussion = async (req, res) => {
  try {
    const { vote } = req.body; // Expected: "up" or "down"
    if (!["up", "down"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const userId = req.user._id;
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) return res.status(404).json({ message: "Discussion not found" });

    // Convert voteType to numeric value
    const voteValue = vote === "up" ? 1 : -1;

    // Check if the user has already voted
    const existingVoteIndex = discussion.voteRecords.findIndex(
      (record) => record.user.toString() === userId.toString()
    );

    if (existingVoteIndex > -1) {
      // If same vote is cast, remove it (toggle off)
      if (discussion.voteRecords[existingVoteIndex].vote === voteValue) {
        discussion.voteRecords.splice(existingVoteIndex, 1);
      } else {
        // If a different vote is cast, update it
        discussion.voteRecords[existingVoteIndex].vote = voteValue;
      }
    } else {
      // Add new vote record
      discussion.voteRecords.push({ user: userId, vote: voteValue });
    }

    // Calculate total votes
    discussion.votes = discussion.voteRecords.reduce((sum, record) => sum + record.vote, 0);
    await discussion.save();

    res.json(discussion);
  } catch (error) {
    console.error("Error handling vote:", error);
    res.status(500).json({ message: error.message });
  }
};
