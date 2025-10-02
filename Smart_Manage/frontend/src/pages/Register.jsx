// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      const interestsArr = interests.split(',').map(s => s.trim()).filter(Boolean);
      const res = await API.post('/auth/register', { name, email, password, interests: interestsArr });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('Registered');
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{maxWidth:360}}>
      <h2>Register</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <input placeholder="Interests (comma separated)" value={interests} onChange={e=>setInterests(e.target.value)} />
      <button onClick={submit}>Register</button>
    </div>
  );
}
