const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true }, // e.g., "2025-04-15"
  time: { type: String, required: true }, // e.g., "14:00"
  location: { type: String, required: true },
  description: { type: String },
  organizer: { type: String, required: true }, // Educator's name
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);