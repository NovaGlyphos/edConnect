const mongoose = require("mongoose");

const DiscussionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    votes: { type: Number, default: 0 },
    voteRecords: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        vote: { type: Number, enum: [1, -1] },
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", DiscussionSchema);
