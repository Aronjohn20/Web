// backend/routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// POST /api/book  -> protected
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, seats = 1 } = req.body;
    if (!eventId) return res.status(400).json({ msg: 'Missing eventId' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.seatsBooked + seats > event.seatsTotal) {
      return res.status(400).json({ msg: 'Not enough seats available' });
    }

    event.seatsBooked += seats;
    await event.save();

    const booking = new Booking({ user: req.user.id, event: event._id, seats });
    await booking.save();

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/bookings/me -> protected
router.get('/me', auth, async (req, res) => {
  try {
    const myBookings = await Booking.find({ user: req.user.id }).populate('event');
    res.json(myBookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
