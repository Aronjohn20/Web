// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// GET /api/analytics
router.get('/', async (req, res) => {
  try {
    const categoryAgg = await Booking.aggregate([
      { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'eventDoc' } },
      { $unwind: '$eventDoc' },
      { $group: { _id: '$eventDoc.category', attendees: { $sum: '$seats' } } }
    ]);

    const daily = await Booking.aggregate([
      { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'eventDoc' } },
      { $unwind: '$eventDoc' },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$eventDoc.date' } }, attendees: { $sum: '$seats' } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ categoryAgg, daily });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
