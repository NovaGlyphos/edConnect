const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");

const router = express.Router();

// Get all users (admin only)
router.get("/users", protect, admin, getAllUsers);

// Delete a user (admin only)
router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
