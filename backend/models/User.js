const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Store password as plain text (not recommended for production)
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "educator"], default: "student" },
  profilePic: { type: String },
  // Other fields...
});

// Removed the pre-save hook that was used to hash the password
// Removed the matchPassword method

module.exports = mongoose.model("User", userSchema);
