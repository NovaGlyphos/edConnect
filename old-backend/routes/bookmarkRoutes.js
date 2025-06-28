// backend/routes/bookmarkRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const Bookmark = require("../models/Bookmark");
const Post = require("../models/Post");

const router = express.Router();

// Toggle bookmark on a post
router.post("/:postId", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingBookmark = await Bookmark.findOne({
      user: req.user.id,
      post: req.params.postId,
    });

    if (existingBookmark) {
      // Remove bookmark if it exists
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.json({ message: "Bookmark removed", bookmarked: false });
    } else {
      // Add bookmark if it doesn't exist
      const bookmark = new Bookmark({
        user: req.user.id,
        post: req.params.postId,
      });
      await bookmark.save();
      res.json({ message: "Bookmark added", bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookmarked posts for the current user
router.get("/", protect, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).populate({
      path: "post",
      populate: { path: "author", select: "name" },
    });
    const posts = bookmarks
      .map((bookmark) => bookmark.post)
      .filter((post) => post) // Filter out null posts (in case a post was deleted)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt descending
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;