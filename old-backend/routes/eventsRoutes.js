const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getEvents, createEvent, registerForEvent } = require("../controllers/eventsController");

router.get("/", protect, getEvents);
router.post("/", protect, createEvent);
router.post("/register/:eventId", protect, registerForEvent);

module.exports = router;