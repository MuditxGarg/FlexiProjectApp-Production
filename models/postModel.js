const mongoose = require("mongoose");

// Schema
const postSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    title: {
      type: String,
      required: [true, "Please add post title"],
    },
    description: {
      type: String,
      required: [true, "Please add post description"],
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
