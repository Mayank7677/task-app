const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    list: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("lists", listSchema);
