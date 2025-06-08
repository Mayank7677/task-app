const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");
const listModel = require("../models/listModel");

exports.createTask = async (req, res) => {
  try {
    const { listId, task } = req.body;
    const userId = req.user._id;

    // Check if the list exists
    const list = await listModel.findById(listId);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    // Create the new task
    const newTask = await taskModel.create({
      task,
      userId,
      listId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find()
      .populate("userId", "username email")
      .populate("listId", "list")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

exports.updateTaskList = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { listId } = req.body;

    const updatedTask = await taskModel.findByIdAndUpdate(
      taskId,
      { listId },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task list updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task list",
      error: error.message,
    });
  }
};
