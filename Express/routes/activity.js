const CRUD = require("../event-note/crud.service");
const Activity = require("../models/Activity");
const router = require("express").Router();

const allowed_Activity = [ 'user', 'completed', 'title', 'expirationDay', 'colour', 'description' ];

// Routes: EVENTS
router.post('/', async (req, res) => {
	const cleanData = CRUD.sanitizeBody(req.body, allowed_Activity);
	await CRUD.Create(Activity, cleanData, res, "activity");
});
router.get('/', async (req, res) => {
	await CRUD.Read(Activity, res, "activity", req.query);
});
router.get('/:id', async (req, res) => {
	await CRUD.ReadById(Activity, req.params.id, res, "activity");
});
router.put('/:id', async (req, res) => {
	const cleanData = CRUD.sanitizeBody(req.body, allowed_Activity);
	await CRUD.Update(Activity, req.params.id, cleanData, res, "activity");
});
router.delete('/:id', async (req, res) => {
	await CRUD.Delete(Activity, req.params.id, res, "activity");
});

module.exports = router;
