require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const projectRoutes = require("./routes/projectRoutes");
const tagRoutes = require("./routes/tagRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");



const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);
app.use("/tags", tagRoutes);
app.use("/tasks", taskRoutes);
app.use("/report", reportRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Workasana API is running" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});