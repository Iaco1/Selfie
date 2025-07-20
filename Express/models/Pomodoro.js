const mongoose = require('mongoose');

const PomodoroSchema = new mongoose.Schema({
  startTime: {type: String, required: true},
  endTime: {type: String, required: true},
  duration: {type: Number, required: true},
  completionStatus: {type: Boolean, required: true},
  authorId: {type: String, required: true},
  authorUsername: {type: String}
});

module.exports = mongoose.model("Pomodoro", PomodoroSchema);