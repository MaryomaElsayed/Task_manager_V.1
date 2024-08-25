const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose); // Import mongoose-sequence
const port = 4000;

// Import ObjectId from mongoose.Types
const { ObjectId } = mongoose.Types;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "Front_end" directory
app.use("/css", express.static(path.join(__dirname, "Front_end", "css")));
app.use("/js", express.static(path.join(__dirname, "Front_end", "js")));
app.use("/img", express.static(path.join(__dirname, "Front_end", "img")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Front_end", "pages", "signup.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Front_end", "pages", "login.html"));
});

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Front_end", "pages", "signup.html"));
});

app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Front_end", "pages", "dashboard.html"));
});

// Connect to MongoDB local
const mongoURI = "mongodb://localhost:27017/new_task_manager";

// Old one
//  // mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Task Schema
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  day: String,
  month: String,
  year: String,
  status: String,
  added_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
});

// Define User Schema with auto-increment plugin
const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  tasks: [taskSchema], // Embed Task Schema
});

// Add auto-increment plugin
userSchema.plugin(mongooseSequence, { inc_field: "user_id" });

// Create User Model
const User = mongoose.model("User", userSchema);

app.post("/api/users", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }
  try {
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      tasks: [],
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(
      {},
      "user_id first_name last_name email tasks"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/users/:userId/tasks", async (req, res) => {
  const { userId } = req.params;
  const { name, description, day, month, year, status } = req.body;
  const added_date = Date.now();
  const updated_date = added_date;

  if (!name || !description || !day || !month || !year || !status) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newTask = {
      name,
      description,
      day,
      month,
      year,
      status,
      added_date,
      updated_date,
    };
    user.tasks.push(newTask);
    await user.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/users/:userId/tasks", async (req, res) => {
  try {
    const userId = Number(req.params.userId); // Convert to number
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user.tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/users/:userId/tasks/:taskId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const taskId = new ObjectId(req.params.taskId); // Convert taskId to ObjectId

    const user = await User.findOne(
      { user_id: userId, "tasks._id": taskId },
      { "tasks.$": 1 }
    );
    if (!user) {
      return res.status(404).send("Task not found");
    }

    const task = user.tasks[0];
    res.json({
      name: task.name,
      description: task.description,
      day: task.day,
      month: task.month,
      year: task.year,
      status: task.status,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//Update the taaaaaaske

app.put("/api/users/:userId/tasks/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;
  const { name, description, day, month, year, status } = req.body;

  try {
    const user = await User.findOne({ user_id: Number(userId) });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const task = user.tasks.id(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    task.name = name || task.name;
    task.description = description || task.description;
    task.day = day || task.day;
    task.month = month || task.month;
    task.year = year || task.year;
    task.status = status || task.status;
    task.updated_date = new Date();

    await user.save();

    res.json(task);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/api/users/:userId/tasks/:taskId", async (req, res) => {
  const { userId, taskId } = req.params;

  if (!userId || !taskId) {
    return res.status(400).send("User ID and Task ID are required");
  }

  try {
    // Find the user by user_id
    const user = await User.findOne({ user_id: Number(userId) });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Remove the task using pull
    const task = user.tasks.id(taskId);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    user.tasks.pull(taskId); // Use pull to remove the task
    await user.save();

    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Error deleting task: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
