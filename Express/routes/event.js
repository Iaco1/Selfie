const CRUD = require("../event-note/crud.service");
const Event = require("../models/Event");
const router = require("express").Router();

const allowed_Event = ['title', 'description', 'start', 'end', 'duration', 'colour', 'user', 'location', 'repeat', 'notification', 'pomodoro'];

// Routes: EVENTS
router.post('/', async (req, res) => {
	const cleanData = CRUD.sanitizeBody(req.body, allowed_Event);
	await CRUD.Create(Event, cleanData, res, "event");
});
router.get('/', async (_, res) => {
	await CRUD.Read(Event, res, "event");
});
router.get('/:id', async (req, res) => {
	await CRUD.ReadById(Event, req.params.id, res, "event");
});
router.put('/:id', async (req, res) => {
	const cleanData = CRUD.sanitizeBody(req.body, allowed_Event);
	await CRUD.Update(Event, req.params.id, cleanData, res, "event");
});
router.delete('/:id', async (req, res) => {
	await CRUD.Delete(Event, req.params.id, res, "event");
});

module.exports = router;
