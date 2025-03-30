const Educator = require("../models/Educator");
const User = require("../models/User");

exports.getEducators = async (req, res) => {
  try {
    const educators = await Educator.find().populate("user", "name email profilePhoto");
    res.json(educators);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEducatorById = async (req, res) => {
  try {
    const educator = await Educator.findById(req.params.id).populate("user", "name email profilePhoto");
    if (!educator) return res.status(404).json({ message: "Educator not found" });
    res.json(educator);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const { id } = req.params; // educator id
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
