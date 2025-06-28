const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getNotifications, markAsRead, clearAllNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);
router.delete("/clear", protect, clearAllNotifications); // New route to clear all notifications

module.exports = router;