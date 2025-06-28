const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getEducators } = require("../controllers/educatorController");

const router = express.Router();

router.get("/", protect, getEducators);

module.exports = router;