const Post = require("../models/Post");
const Notification = require("../models/Notification");

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments();

    res.json({
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error in getPosts:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newPost = new Post({
      author: req.user._id,
      text,
      image,
    });

    const post = await newPost.save();
    const populatedPost = await Post.findById(post._id).populate("author", "name");

    req.io.emit("newPost", populatedPost);

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error in createPost:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    console.log("Entering likePost function");

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
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
        user: post.author,
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

    res.json({ message: "Post like status updated", likes: post.likes });
  } catch (err) {
    console.error("Error in likePost:", err.message);
    res.status(500).json({ error: "Failed to update like status or save notification" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error in deletePost:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPosts, createPost, likePost, deletePost };