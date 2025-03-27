const express = require("express");
const { getEducators, toggleFollow } = require("../controllers/educatorController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getEducators);
router.post("/:id/follow", protect, toggleFollow);

module.exports = router;
