const mongoose = require('mongoose');
const DateType = require('../event-note/DateType');
const NotificationType = require('../event-note/NotificationType');

const PomodoroValueSchema = new mongoose.Schema({
	studyFor: { type: Number, required: false },
	restFor: { type: Number, required: false },
	sessionTime: { type: Number, required: false },
	completed: { type: Boolean, required: false }
}, { _id: false });

const EventSchema = new mongoose.Schema({
	user: { type: String, required: true },
	title: { type: String, required: true },
	start: { type: DateType, required: true },
	end: { type: DateType, required: true },
	duration: {
		number: { type: Number },
		measure: { type: String }
	},
	colour: { type: String },
	description: { type: String },
	location: { type: String },
	repeat: {
		bool: { type: Boolean },
		rrule: { type: String }
	},
	notification: {
		type: [NotificationType]
	},
	pomodoro: {
		bool: { type: Boolean },
		value: {
			type: PomodoroValueSchema,
			required: false
		}
	}
}, { versionKey: false });

module.exports = mongoose.model('Event', EventSchema);
