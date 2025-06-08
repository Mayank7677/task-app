const listModel = require("../models/listModel");
const userModel = require("../models/userModel");

exports.createList = async (req, res) => {
  console.log(req.user)
  try {
    const { list } = req.body;
    const userId = req.user._id;
    const newList = await listModel.create({ list, userId });

    res.status(201).json({
      success: true,
      message: "List created successfully",
      list: newList,
    });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create list",
      error: error.message,
    });
  }
}; 

exports.getAllLists = async (req, res) => {
  try {
    const lists = await listModel
      .find()
      .populate("userId", "username email")
    res.status(200).json({
      success: true,
      list: lists,
    });
  } catch (error) {
    console.log("Error fetching lists:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lists",
      error: error.message,
    });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { listId } = req.params;
    const deletedList = await listModel.findByIdAndDelete(listId);

    if (!deletedList) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "List deleted successfully",
      list: deletedList,
    });
  } catch (error) {
    console.log("Error deleting list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete list",
      error: error.message,
    });
  }
};
