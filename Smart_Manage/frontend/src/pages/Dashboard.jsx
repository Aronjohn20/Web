// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // upcoming events (public)
      const ev = await API.get('/events');
      setUpcoming(ev.data.slice(0,5));

      // my bookings (protected)
      const token = localStorage.getItem('token');
      if (token) {
        const b = await API.get('/bookings/me');
        setBookings(b.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
      alert('Could not fetch dashboard data');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      <section>
        <h3>Upcoming Events</h3>
        {upcoming.map(e => <div className="card" key={e._id}>{e.title} — {new Date(e.date).toLocaleDateString()}</div>)}
      </section>

      <section style={{marginTop:16}}>
        <h3>Your Bookings</h3>
        {bookings.length === 0 && <p>No bookings (login and book an event)</p>}
        {bookings.map(b => (
          <div className="card" key={b._id}>
            <div>{b.event.title}</div>
            <div>Seats: {b.seats}</div>
            <div>Booked At: {new Date(b.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
