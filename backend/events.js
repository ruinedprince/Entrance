const express = require('express');
const router = express.Router();

// Mock event database
const events = [];

// Create event
router.post('/create', (req, res) => {
    const { title, description, date, location } = req.body;
    const event = { id: events.length + 1, title, description, date, location };
    events.push(event);
    res.status(201).json({ message: 'Event created successfully', event });
});

// List events
router.get('/', (req, res) => {
    res.status(200).json(events);
});

// Update event
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, date, location } = req.body;
    const event = events.find(event => event.id === parseInt(id));
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }
    Object.assign(event, { title, description, date, location });
    res.status(200).json({ message: 'Event updated successfully', event });
});

// Delete event
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = events.findIndex(event => event.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }
    events.splice(index, 1);
    res.status(200).json({ message: 'Event deleted successfully' });
});

module.exports = router;