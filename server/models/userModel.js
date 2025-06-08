const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      // required: true,
    },
    otpTimer: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users' , userSchema)
