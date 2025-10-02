import React, { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  const handleBook = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first!");
      return;
    }

    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Booking successful!");
    } else {
      alert(data.message || "Booking failed");
    }
  };

  return (
    <div>
      <h2>Explore Events</h2>
      {events.map(event => (
        <div key={event._id} style={{border: "1px solid #ccc", margin: "10px", padding: "10px"}}>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>Category: {event.category}</p>
          <p>Date: {new Date(event.date).toDateString()}</p>
          <p>Seats Available: {event.seats - event.booked}</p>
          <button onClick={() => handleBook(event._id)}>Book Now</button>
        </div>
      ))}
    </div>
  );
}

export default Events;

