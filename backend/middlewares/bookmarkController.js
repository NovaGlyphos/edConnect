const Bookmark = require("../models/Bookmark");

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate("post");
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
