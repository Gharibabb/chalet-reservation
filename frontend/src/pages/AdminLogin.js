import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch {
      alert("Connexion échouée.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Connexion admin</h2>
      <form onSubmit={login}>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <button type="submit" style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white' }}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
