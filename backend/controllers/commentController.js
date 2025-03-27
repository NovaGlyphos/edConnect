const Comment = require("../models/Comment");

exports.likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user._id;

    // If the user already liked the comment, remove the like (unlike)
    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
      await comment.save();
      return res.json({ message: "Comment unliked", likes: comment.likes });
    } else {
      // Else, add the like
      comment.likes.push(userId);
      await comment.save();
      return res.json({ message: "Comment liked", likes: comment.likes });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
