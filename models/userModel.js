const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please add first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "please add last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please add email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please add password"],
      min: 6,
      max: 64,
    },
    location: {
      type: String,
      required: [true, "please add location"],
      trim: true,
    },
    profession: {
      type: String,
      required: [true, "please add profession"],
      trim: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
