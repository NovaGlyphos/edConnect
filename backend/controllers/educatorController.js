const User = require("../models/User");

const getEducators = async (req, res) => {
  try {
    const educators = await User.find({ role: "educator" }).select("name profilePic _id");
    res.json(educators);
  } catch (err) {
    console.error("Error in getEducators:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getEducators };