const Post = require("../models/Post");
const Discussion = require("../models/Discussion");
const User = require("../models/User");
const Event = require("../models/Event");

const searchAll = async (req, res) => {
  try {
    const searchQuery = req.query.query || "";
    if (!searchQuery) {
      return res.json({ posts: [], discussions: [], educators: [], events: [] });
    }

    // Search Posts
    const posts = await Post.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { text: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Search Discussions
    const discussions = await Discussion.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // Search Educators
    const educators = await User.find({
      role: "educator",
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { bio: { $regex: searchQuery, $options: "i" } },
        { educationalInstitution: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("name bio educationalInstitution profilePic _id")
      .limit(10);

    // Search Events
    const events = await Event.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { organizer: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("registeredUsers", "name")
      .sort({ date: 1 })
      .limit(10);

    res.json({
      posts,
      discussions,
      educators,
      events: events.map((event) => ({
        ...event._doc,
        registered: event.registeredUsers.some((user) =>
          user._id.toString() === req.user._id.toString()
        ),
      })),
    });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Failed to perform search", error: error.message });
  }
};

module.exports = { searchAll };