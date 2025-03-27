const express = require("express");
const { createPost, getPosts, getPostById, likePost } = require("../controllers/postController");
const { body } = require("express-validator");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../utils/fileUpload");

const router = express.Router();

// ✅ Ensure all controller functions exist before using them
if (!createPost || !getPosts || !getPostById || !likePost) {
  throw new Error("One or more post controller functions are missing!");
}

router.post("/", protect, upload.single("file"), [body("text").optional().trim()], createPost);
router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.patch("/:id/like", protect, likePost);

module.exports = router;
