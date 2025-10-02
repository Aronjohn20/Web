// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events -> list events (optionally filter by category or q)
router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
