const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./lib/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const listRoute = require("./routes/listRoute");
const taskRoute = require("./routes/taskRoute");

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL and port
    credentials: true,
  })
);

connectDB();

app.use("/users", userRoute);
app.use("/lists", listRoute);
app.use("/tasks", taskRoute);

app.listen(PORT, () => {
  console.log(`server is runing on port ${PORT}`);
});
