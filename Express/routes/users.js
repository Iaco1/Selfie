// Import Express and Mongoose
var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

// Define a Mongoose schema for the User collection
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
});

// Create a Mongoose model for interacting with the 'users' collection
const User = mongoose.model('User', userSchema);

// Route: GET /users
// Fetch and return all users as JSON
router.get('/', async function(req, res, next) {
  try {
    const users = await User.find(); // fetch all users from MongoDB
    res.json(users); // return them as JSON
  } catch (err) {
    res.status(500).send('Error fetching users'); // error handling
  }
});

// Export the router to be used in app.js
module.exports = router;
