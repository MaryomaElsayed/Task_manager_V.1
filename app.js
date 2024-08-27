const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// Hashing passwords
// Download this ya abdoooooo
const bcrypt = require("bcrypt");
const User = require("./models/User");

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
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Disable bcrypt compare for testing purposes
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Directly compare passwords (not recommended for production)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Respond with the user's ID and other necessary details
    res.json({ userId: user._id, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

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
      password, // Note: Hashing password is recommended
      tasks: [],
      _id: new ObjectId(), // Ensure an ObjectId is set if required
    });
    await newUser.save();
    res.status(201).json(newUser);
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
    // Convert the userId to an ObjectId
    const user = await User.findOne({ _id: new ObjectId(userId) });

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
    const userId = req.params.userId;

    // Correctly instantiate ObjectId with the 'new' keyword
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user.tasks);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send(err.message);
  }
});

app.get("/api/users/:userId/tasks/:taskId", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId); // Convert userId to ObjectId
    const taskId = new ObjectId(req.params.taskId); // Convert taskId to ObjectId

    // Find the user by ObjectId and look for the task with the matching taskId
    const user = await User.findOne(
      { _id: userId, "tasks._id": taskId },
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
    // Convert userId to ObjectId
    const user = await User.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the task by taskId (ObjectId)
    const task = user.tasks.id(new ObjectId(taskId));
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // Update task details
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
    // Convert userId to ObjectId
    const user = await User.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find the task by taskId (ObjectId)
    const task = user.tasks.id(new ObjectId(taskId));
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // Remove the task using pull
    user.tasks.pull(new ObjectId(taskId)); // Use pull to remove the task by ObjectId
    await user.save();

    res.status(204).send();
  } catch (err) {
    res.status(500).send(`Error deleting task: ${err.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
