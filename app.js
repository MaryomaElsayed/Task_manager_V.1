const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose); // Import mongoose-sequence
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "Front_end" directory
app.use('/css', express.static(path.join(__dirname, 'Front_end', 'css')));
app.use('/js', express.static(path.join(__dirname, 'Front_end', 'js')));
app.use('/img', express.static(path.join(__dirname, 'Front_end', 'img')));

// Serve the HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front_end', 'pages', 'signup.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front_end', 'pages', 'login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front_end', 'pages', 'signup.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front_end', 'pages', 'dashboard.html'));
});

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/taskmanager';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas and models

// Define User Schema with auto-increment plugin
const userSchema = new mongoose.Schema({
    user_id: Number,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    tasks: [{
        name: String,
        description: String,
        day: String,
        month: String,
        year: String,
        status: String,
        added_date: Date,
        updated_date: Date
    }]
});

// Add auto-increment plugin
userSchema.plugin(mongooseSequence, { inc_field: 'user_id' });

// Create User Model
const User = mongoose.model('User', userSchema);

// API Endpoints

// POST /api/users - Create a new user
app.post('/api/users', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const newUser = new User({ first_name, last_name, email, password, tasks: [] });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req, res) => {
    const { user_id, name, description, day, month, year, status, added_date, updated_date } = req.body;
    if (!user_id || !name || !description || !day || !month || !year || !status || !added_date || !updated_date) {
        return res.status(400).send('Missing required fields');
    }
    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const newTask = { name, description, day, month, year, status, added_date, updated_date };
        user.tasks.push(newTask);
        await user.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET /api/users/:id/tasks - Retrieve tasks associated with a specific user
app.get('/api/users/:id/tasks', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET /api/tasks/:taskId - Retrieve a specific task by ID
app.get('/api/tasks/:taskId', async (req, res) => {
    try {
        const user = await User.findOne({ 'tasks._id': req.params.taskId }, { 'tasks.$': 1 });
        if (!user) {
            return res.status(404).send('Task not found');
        }
        res.json(user.tasks[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// PUT /api/tasks/:id - Update an existing task by ID
app.put('/api/tasks/:id', async (req, res) => {
    const { user_id, name, description, day, month, year, status, added_date, updated_date } = req.body;
    try {
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const task = user.tasks.id(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        task.name = name || task.name;
        task.description = description || task.description;
        task.day = day || task.day;
        task.month = month || task.month;
        task.year = year || task.year;
        task.status = status || task.status;
        task.added_date = added_date || task.added_date;
        task.updated_date = updated_date || task.updated_date;
        await user.save();
        res.json(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE /api/tasks/:id - Delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.body.user_id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const task = user.tasks.id(req.params.id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        task.remove();
        await user.save();
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



