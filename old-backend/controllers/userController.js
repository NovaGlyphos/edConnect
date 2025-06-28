const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) return res.status(404).json({ message: "User not found" });

    const currentUser = await User.findById(req.user._id);
    if (currentUser._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    await Promise.all([currentUser.save(), userToFollow.save()]);

    const notification = new Notification({
      user: userToFollow._id,
      type: "follow",
      relatedId: currentUser._id,
      message: `${req.user.name || "A user"} followed you`,
    });
    const savedNotification = await notification.save();
    const populatedNotification = await Notification.findById(savedNotification._id)
      .populate("user", "name")
      .lean();
    req.io.to(userToFollow._id.toString()).emit("newNotification", populatedNotification);

    res.json({ message: `Now following ${userToFollow.name}`, following: currentUser.following });
  } catch (err) {
    console.error("Error in followUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (!userToUnfollow) return res.status(404).json({ message: "User not found" });

    const currentUser = await User.findById(req.user._id);
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    res.json({ message: `Unfollowed ${userToUnfollow.name}`, following: currentUser.following });
  } catch (err) {
    console.error("Error in unfollowUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password") // Includes bio and educationalInstitution by default
      .populate("following", "name")
      .populate("followers", "name");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json({ user, posts });
  } catch (err) {
    console.error("Error in getUserProfile:", err.message);
    res.status(500).json({ error: err.message });
  }
};
module.exports = { followUser, unfollowUser, getUserProfile };