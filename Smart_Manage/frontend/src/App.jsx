// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="nav">
        <Link to="/" style={{color:'#fff'}}>Events</Link>
        <Link to="/dashboard" style={{color:'#fff'}}>Dashboard</Link>
        <Link to="/analytics" style={{color:'#fff'}}>Analytics</Link>
        <Link to="/login" style={{color:'#fff'}}>Login</Link>
        <Link to="/register" style={{color:'#fff'}}>Register</Link>
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<Events/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

