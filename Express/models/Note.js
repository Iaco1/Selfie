const mongoose = require('mongoose');
const DateType = require('../event-note/DateType');

const NoteSchema = new mongoose.Schema({
	//setted by the program
	author: {type: String, required: true},
	//required true
	title: {type: String, required: true},
	text: {type: String, required: true},
	creation: {type: DateType, required: true},
	lastModification: {type: DateType, required: true},
	//required false
	tags: [{type: String, required: false}]
}, { versionKey: false });

module.exports = mongoose.model('Note', NoteSchema);
