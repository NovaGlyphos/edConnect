const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { followUser, unfollowUser, getUserProfile } = require("../controllers/userController");

const router = express.Router();

router.post("/follow/:id", protect, followUser);
router.post("/unfollow/:id", protect, unfollowUser);
router.get("/profile/:id", protect, getUserProfile);

module.exports = router;