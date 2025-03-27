const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjects: [{ type: String }],
  // Optionally you can store an icon URL or class if needed
}, { timestamps: true });

module.exports = mongoose.model("Subject", subjectSchema);
