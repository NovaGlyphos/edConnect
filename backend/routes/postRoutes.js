const express = require("express");
const multer = require("multer");
const { protect } = require("../middlewares/authMiddleware");
const Post = require("../models/Post");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Get all posts
router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 });
    // Check which posts are bookmarked by the current user
    const bookmarks = await Bookmark.find({ user: req.user.id });
    const bookmarkedPostIds = bookmarks.map((bookmark) => bookmark.post.toString());
    const postsWithBookmarkStatus = posts.map((post) => ({
      ...post.toObject(),
      bookmarked: bookmarkedPostIds.includes(post._id.toString()),
    }));
    res.json(postsWithBookmarkStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single post by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the post is bookmarked by the current user
    const bookmark = await Bookmark.findOne({ user: req.user.id, post: req.params.id });
    const postWithBookmarkStatus = {
      ...post.toObject(),
      bookmarked: !!bookmark,
    };
    res.json(postWithBookmarkStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a post
router.post("/", protect, upload.single("file"), async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);
  const { text, fileType } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    if (!text && !image) {
      return res.status(400).json({ message: "Post must have text or a file" });
    }
    const post = new Post({
      text,
      image,
      fileType,
      author: req.user.id,
      likes: [],
    });
    const savedPost = await post.save();
    const populatedPost = await Post.findById(savedPost._id).populate("author", "name");
    res.status(201).json({ ...populatedPost.toObject(), bookmarked: false }); // New post won't be bookmarked
  } catch (error) {
    console.error("Error in post creation:", error);
    res.status(500).json({ message: error.message });
  }
});

// Like a post
// Backend: postRoutes.js

router.patch("/:id/like", protect, async (req, res) => {
  try {
    console.log("Entering likePost function");

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const index = post.likes.indexOf(userId);

    let action = "";
    if (index === -1) {
      post.likes.push(userId);
      action = "liked";
    } else {
      post.likes.splice(index, 1);
      action = "unliked";
    }

    await post.save();
    console.log(`Post ${post._id} ${action} by user ${userId}`);

    // Check if notification should be created
    console.log("Checking notification condition:");
    console.log("Action:", action);
    console.log("Post author:", post.author.toString());
    console.log("User ID:", userId.toString());
    console.log("Condition result:", action === "liked" && post.author.toString() !== userId.toString());

    if (action === "liked" && post.author.toString() !== userId.toString()) {
      console.log("Entering notification creation block for user:", post.author.toString());

      // Create notification object
      const notification = new Notification({
        user: post.author, // Notification for the post author
        type: "like",
        relatedId: post._id,
        message: `${req.user.name || "A user"} liked your post`,
      });
      console.log("Notification object before save:", notification);

      // Save notification
      const savedNotification = await notification.save();
      console.log("Notification saved to DB:", savedNotification);

      // Populate and emit
      const populatedNotification = await Notification.findById(savedNotification._id)
        .populate("user", "name")
        .lean();
      console.log("Populated notification:", populatedNotification);

      req.io.to(post.author.toString()).emit("newNotification", populatedNotification);
      console.log(`Notification emitted to ${post.author.toString()}:`, populatedNotification);
    } else {
      console.log("Notification not created: Either not a like action or user is the author");
    }

    const bookmark = await Bookmark.findOne({ user: req.user.id, post: req.params.id });
    res.json({ ...post.toObject(), bookmarked: !!bookmark });
  } catch (error) {
    console.error("Error in likePost:", error.message);
    res.status(500).json({ message: "Failed to update like status or save notification" });
  }
});

module.exports = router;