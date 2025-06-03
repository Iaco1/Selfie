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

const bcrypt = require('bcrypt');           // Import bcrypt for password hashing comparison
const jwt = require('jsonwebtoken');        // Import JWT for generating authentication tokens

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);

  const user = await User.findOne({ email });
  console.log('User found:', user);

  if (!user) {
    console.log('No user found');
    return res.status(401).send('Invalid email');
  }

  const valid = await bcrypt.compare(password, user.password);
  console.log('Password valid:', valid);

  if (!valid) {
    console.log('Invalid password');
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ userId: user._id }, 'secretKey');
  console.log('JWT token generated:', token);

  res.json({ token });
});



// Export the router to be used in app.js
module.exports = router;
