const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    image: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);