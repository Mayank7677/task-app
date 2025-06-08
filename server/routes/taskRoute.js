const taskController = require("../controllers/taskController");
const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, taskController.createTask);
router.get("/getAll", auth, taskController.getAllTasks);
router.put("/moveTask/:taskId", auth, taskController.updateTaskList);

module.exports = router;
