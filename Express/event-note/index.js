const mongoose = require('mongoose');
const express = require('express');
const app = express();

const CRUD = require('./crud.service');
const Event = require('./event.model');
const Note = require('./note.model');

function sanitizeBody(body, allowedFields) {
	const clean = {};
	for (let key of allowedFields) {
		if (body[key] !== undefined) clean[key] = body[key];
	}
	return clean;
}

const allowed_Note = ['title', 'author', 'text', 'tags', 'creation', 'lastModification'];
const allowed_Event = ['title', 'description', 'start', 'end', 'colour', 'user', 'location', 'repeat', 'notification', 'pomodoro'];

// Connect to Mongo once at startup
mongoose.connect('mongodb://localhost:27017/selfie').then(() => {
	console.log('Connected to MongoDB');
}).catch(err => {
	console.error('MongoDB connection error:', err);
});

app.use(express.json());

// Routes: NOTES
app.post('/notes', async (req, res) => {
	const cleanData = sanitizeBody(req.body, allowed_Note);
	await CRUD.Create(Note, cleanData, res, "note");
});
app.get('/notes', async (_, res) => {
	await CRUD.Read(Note, res, "note");
});
app.get('/notes/:id', async (req, res) => {
	await CRUD.ReadById(Note, req.params.id, res, "note");
});
app.put('/notes/:id', async (req, res) => {
	const cleanData = sanitizeBody(req.body, allowed_Note);
	await CRUD.Update(Note, req.params.id, cleanData, res, "note");
});
app.delete('/notes/:id', async (req, res) => {
	await CRUD.Delete(Note, req.params.id, res, "note");
});

// Routes: EVENTS
app.post('/events', async (req, res) => {
	const cleanData = sanitizeBody(req.body, allowed_Event);
	await CRUD.Create(Event, cleanData, res, "event");
});
app.get('/events', async (_, res) => {
	await CRUD.Read(Event, res, "event");
});
app.get('/events/:id', async (req, res) => {
	await CRUD.ReadById(Event, req.params.id, res, "event");
});
app.put('/events/:id', async (req, res) => {
	const cleanData = sanitizeBody(req.body, allowed_Event);
	await CRUD.Update(Event, req.params.id, cleanData, res, "event");
});
app.delete('/events/:id', async (req, res) => {
	await CRUD.Delete(Event, req.params.id, res, "event");
});

const port = 3002;
app.listen(port);
console.log("Express started on port ", port);
