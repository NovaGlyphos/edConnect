const Educator = require("../models/Educator");
const User = require("../models/User");

// ✅ Fetch all educators
exports.getEducators = async (req, res) => {
  try {
    const educators = await Educator.find().populate("user", "name email");
    res.json(educators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Follow/unfollow an educator
exports.toggleFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    const educator = await Educator.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!educator) return res.status(404).json({ message: "Educator not found" });

    const index = user.followingEducators.indexOf(id);
    if (index === -1) {
      user.followingEducators.push(id);
      educator.followers.push(user._id);
    } else {
      user.followingEducators.splice(index, 1);
      educator.followers.pull(user._id);
    }

    await user.save();
    await educator.save();

    res.json({ success: true, following: user.followingEducators });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
