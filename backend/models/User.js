const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "educator"], default: "student" },
  profilePic: { type: String },
  bio: { type: String }, // Added for profile enhancement
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users this user follows
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users following this user
});

module.exports = mongoose.model("User", userSchema);