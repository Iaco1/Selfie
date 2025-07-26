const mongoose = require('mongoose');
const DateType = require('../event-note/DateType');

const ActivitySchema = new mongoose.Schema({
	//setted by the program
	user: {type: String, required: true},
	//required true
	completed: {type: Boolean, required: true},
	title: {type: String, required: true},
	expirationDay: {type: DateType, required: true},
	//often used but required false
	colour: {type: String, required: false},
	//required false
	description: {type: String, required: false}
}, { versionKey: false });

module.exports = mongoose.model('Activity', ActivitySchema);
