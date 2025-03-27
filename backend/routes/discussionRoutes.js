const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getDiscussions,
  createDiscussion,
  voteDiscussion,
} = require("../controllers/discussionController");

const router = express.Router();

router.get("/", getDiscussions);
router.post("/", protect, createDiscussion);
router.patch("/:id/vote", protect, voteDiscussion);

module.exports = router;
