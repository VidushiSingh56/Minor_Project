// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://hashing-2883.onrender.com/login', { username, password });
      // Save a dummy token and username in localStorage
      localStorage.setItem('authToken', 'dummy_token');
      localStorage.setItem('username', username);
      // Navigate to the Home page with the success message from the backend
      navigate(`/home?message=${encodeURIComponent(response.data.message)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn-submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup here</Link></p>
    </div>
  );
};

export default Login;
