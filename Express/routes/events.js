const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB
mongoose.connect('mongodb://localhost:27017/calendar', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Event model
const Event = mongoose.model('Event', {
    id: String,
    title: String,
    start: Date,
    end: Date,
    color: Object,
    allDay: Boolean,
});

// Routes
app.get('/events', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

app.post('/events', async (req, res) => {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
});

app.put('/events/:id', async (req, res) => {
    const updated = await Event.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
});

app.delete('/events/:id', async (req, res) => {
    await Event.deleteOne({ id: req.params.id });
    res.json({ message: 'Event deleted' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
