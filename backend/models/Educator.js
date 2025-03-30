const mongoose = require("mongoose");

const EducatorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    bio: { type: String, default: "" },
    collegeName: { type: String, default: "" },
    specialty: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Educator", EducatorSchema);
