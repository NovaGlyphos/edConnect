const Bookmark = require("../models/Bookmark");

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate("post");
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    const existing = await Bookmark.findOne({ user: req.user._id, post: postId });
    if (existing) return res.status(400).json({ message: "Already bookmarked" });

    const newBookmark = new Bookmark({ user: req.user._id, post: postId });
    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
