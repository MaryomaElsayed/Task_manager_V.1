const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const port = 30001;

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// mongoose.connect("DB LINK")
// //This func will be excuted if the connecion was correct without errors
// .then(() => {})
// //This func will be excuted if an error occured , print error in console to
// .catch((err) => {console.log(err)});
