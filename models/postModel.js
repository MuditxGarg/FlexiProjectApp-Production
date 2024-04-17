const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Import Schema from mongoose

// Schema
const postSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Corrected
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }], // Corrected
    title: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Please add post description"],
    },
    postedBy: {
      type: Schema.Types.ObjectId, // Corrected
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
