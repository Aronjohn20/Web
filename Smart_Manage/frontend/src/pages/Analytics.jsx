// frontend/src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function Analytics() {
  const [data, setData] = useState({ categoryAgg: [], daily: [] });

  useEffect(() => {
    API.get('/analytics')
      .then(res => setData(res.data))
      .catch(err => {
        console.error(err);
        alert('Could not fetch analytics');
      });
  }, []);

  const barData = {
    labels: data.categoryAgg.map(c => c._id || 'Unknown'),
    datasets: [
      {
        label: 'Attendees',
        data: data.categoryAgg.map(c => c.attendees),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const lineData = {
    labels: data.daily.map(d => d._id),
    datasets: [
      {
        label: 'Daily attendees',
        data: data.daily.map(d => d.attendees),
        borderColor: 'rgba(153,102,255,1)',
        tension: 0.3
      }
    ]
  };

  return (
    <div>
      <h2>Analytics</h2>

      <div style={{maxWidth:700, marginBottom:24}}>
        <h4>Attendees by Category</h4>
        <Bar data={barData} />
      </div>

      <div style={{maxWidth:700}}>
        <h4>Daily attendees (by event date)</h4>
        <Line data={lineData} />
      </div>
    </div>
  );
}
