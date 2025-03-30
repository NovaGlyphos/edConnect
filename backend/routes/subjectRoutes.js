const express = require("express");
const { getSubjects, getSubjectById } = require("../controllers/subjectController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getSubjects);
router.get("/:id", protect, getSubjectById);

module.exports = router;
