const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  hash: {type: String, required: true},
  salt: {type: String, required: true},
  password: {type: String, required: true}
});

module.exports = mongoose.model("User", UserSchema);