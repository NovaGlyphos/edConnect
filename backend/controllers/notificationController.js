const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Get notifications error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    notification.read = true;
    await notification.save();
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark as read error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error("Clear notifications error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotifications, markAsRead, clearAllNotifications };