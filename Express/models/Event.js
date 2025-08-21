const mongoose = require('mongoose');
const DateType = require('../event-note/DateType');
const NotificationType = require ('../event-note/NotificationType');

const EventSchema = new mongoose.Schema({
	//setted by the program
	user: {type: String, required: true},
	//required true
	title: {type: String, required: true},
	start: {type: DateType, required: true},
	end: {type: DateType, required: true},	
	//often used but required false
	duration: {
		number: {type: Number, required: false},
		measure: {type: String, required: false}
	},
	colour: {type: String, required: false},
	//required false
	description: {type: String, required: false},
	location: {type: String, required: false},
	repeat: {
		bool: {type: Boolean, required: false},
		rrule: {type: String, required: false}
	},
	notification: {
		type: [NotificationType],
		required: false
	},
	pomodoro: {
		bool: {type: Boolean, required: false},
		studyFor: {type: String, required: false},
		restFor: {type: String, required: false}
	}
}, { versionKey: false });

module.exports = mongoose.model('Event', EventSchema);
