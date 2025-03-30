const express = require("express");
const { getDiscussions, createDiscussion, voteDiscussion } = require("../controllers/discussionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all discussions (optionally, implement pagination in the controller)
router.get("/", protect, getDiscussions);

// Create a new discussion
router.post("/", protect, createDiscussion);

// Vote on a discussion (upvote/downvote)
router.patch("/:id/vote", protect, voteDiscussion);

module.exports = router;
