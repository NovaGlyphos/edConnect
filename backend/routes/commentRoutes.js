const express = require("express");
const { addComment, getComments, likeComment } = require("../controllers/commentController");
const { body } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true });

// Endpoint to add a comment to a post (existing functionality)
router.post(
  "/",
  protect,
  [body("text").notEmpty().withMessage("Comment text is required")],
  addComment
);

// Endpoint to fetch comments for a post (existing functionality)
router.get("/", protect, getComments);

// New endpoint for liking/unliking a comment
router.patch("/:id/like", protect, likeComment);

module.exports = router;
