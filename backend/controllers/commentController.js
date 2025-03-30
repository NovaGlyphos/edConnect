const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params; // assuming the route is nested (e.g., /api/posts/:postId/comments)
    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate("user", "name profilePhoto").sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    const userId = req.user._id;
    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
      await comment.save();
      return res.json({ message: "Comment unliked", likes: comment.likes });
    } else {
      comment.likes.push(userId);
      await comment.save();
      return res.json({ message: "Comment liked", likes: comment.likes });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
