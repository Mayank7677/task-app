const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lists",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tasks", taskSchema);
