const express = require('express');
const router = express.Router();
const CRUD = require("../event-note/crud.service")
const Note = require('../event-note/note.model');

const allowed_Note = ['title', 'author', 'text', 'tags', 'creation', 'lastModification'];

// Routes: NOTES
router.post('/', async (req, res) => {
	const cleanData = CRUD.sanitizeBody(req.body, allowed_Note);
	await CRUD.Create(Note, cleanData, res, "note");
});
router.get('/', async (_, res) => {
	await CRUD.Read(Note, res, "note");
});

router.get('/:id', async (req, res) => {
	await CRUD.ReadById(Note, req.params.id, res, "note");
});
router.put('/:id', async (req, res) => {
	const cleanData = CRUD.sanitizeBody(req.body, allowed_Note);
	await CRUD.Update(Note, req.params.id, cleanData, res, "note");
});
router.delete('/:id', async (req, res) => {
	await CRUD.Delete(Note, req.params.id, res, "note");
});

module.exports = router;
