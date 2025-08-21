const mongoose = require('mongoose');

const DateType = new mongoose.Schema({
	date: {type: String, required: true},
	time: {type: String, required: false}
}, { _id: false});

module.exports = DateType;
