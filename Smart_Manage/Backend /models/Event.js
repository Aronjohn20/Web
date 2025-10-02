// backend/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Workshop' }, // Workshop, Seminar, Hackathon, Cultural
  date: { type: Date, required: true },
  seatsTotal: { type: Number, required: true, default: 100 },
  seatsBooked: { type: Number, default: 0 },
  tags: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
