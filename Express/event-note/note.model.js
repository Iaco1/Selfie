const mongoose = require('mongoose');
const DateType = require('./DateType');

const NoteSchema = new mongoose.Schema({
  title: {type: String, required: true},
	author: {type: String, required: true},
  text: {type: String, required: true},
  tags: [{type: String, required: false}],
  creation: {type: DateType, required: true},
  lastModification: {type: DateType, required: true}
}, { versionKey: false });

module.exports = mongoose.model('Note', NoteSchema);
