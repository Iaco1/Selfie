const mongoose = require('mongoose');
const DateType = require('../event-note/DateType');

const EventSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, required: false},
	start: {type: DateType, required: true},
	end: {type: DateType, required: true},
	duration: {
		number: {type: Number, required: false},
		measure: {type: String, required: false}
	},
	colour: {type: String, required: false},
	user: {type: String, required: false},
	location: {type: String, required: false},
	repeat: {type: String, required: false},
	notification: [{type: String, required: false}],
	pomodoro: {
		bool: {type: Boolean, required: false},
		studyFor: {type: String, required: false},
		restFor: {type: String, required: false}
	}
}, { versionKey: false });

module.exports = mongoose.model('Event', EventSchema);
