const express = require("express");
const { getBookmarks, addBookmark, removeBookmark } = require("../controllers/bookmarkController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getBookmarks);
router.post("/", protect, addBookmark);
router.delete("/:id", protect, removeBookmark);

module.exports = router;
