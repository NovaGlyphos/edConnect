const Bookmark = require("../models/Bookmark");

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate("post");
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBookmark = async (req, res) => {
  try {
    const existing = await Bookmark.findOne({ user: req.user._id, post: req.body.postId });
    if (existing) return res.status(400).json({ message: "Already bookmarked" });

    const newBookmark = new Bookmark({ user: req.user._id, post: req.body.postId });
    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
