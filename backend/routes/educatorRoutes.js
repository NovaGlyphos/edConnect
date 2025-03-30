const express = require("express");
const { getEducators, getEducatorById, toggleFollow } = require("../controllers/educatorController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all educators
router.get("/", getEducators);

// Get a single educator by ID
router.get("/:id", getEducatorById);

// Follow/Unfollow an educator
router.post("/:id/follow", protect, toggleFollow);

module.exports = router;
