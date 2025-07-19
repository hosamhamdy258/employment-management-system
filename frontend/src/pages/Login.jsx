import React, { useState } from 'react';
import useAuthStore from '../store/auth';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login/', { email, password });
      login(null, res.data.access);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  );
}
