var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
});

const User = mongoose.model(`User`, userSchema);

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

module.exports = router;
