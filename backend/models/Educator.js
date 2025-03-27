const mongoose = require("mongoose");

const EducatorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Link with User
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Track followers
});

module.exports = mongoose.model("Educator", EducatorSchema);
