const mongoose = require('mongoose');

const NotificationType = new mongoose.Schema({
	label: {type: String, required: true},
	title: {type: String, required: false},
	message: {type: String, required: false},
	date: {type: Date, required: true},
	priority: {type: Number, required: false}
}, { _id: false});

module.exports = NotificationType;
