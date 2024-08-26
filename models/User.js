const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence')(mongoose);

// Define Task Schema
const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  day: String,
  month: String,
  year: String,
  status: String,
  added_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now }
});

// Define User Schema with auto-increment plugin
const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true },
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  tasks: [taskSchema] // Embed Task Schema
});

// Add auto-increment plugin
userSchema.plugin(mongooseSequence, { inc_field: 'user_id' });

// Create User Model
const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
