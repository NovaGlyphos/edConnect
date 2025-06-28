// backend/routes/commentRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

// Create a comment on a post
router.post("/:postId", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const comment = new Comment({
      post: req.params.postId,
      author: req.user.id,
      text,
      likes: [],
    });
    const savedComment = await comment.save();
    const populatedComment = await Comment.findById(savedComment._id).populate("author", "name");
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for a post
router.get("/", protect, async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res.status(400).json({ message: "postId query parameter is required" });
    }
    const comments = await Comment.find({ post: postId })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;