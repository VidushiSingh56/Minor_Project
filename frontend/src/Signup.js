// src/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://hashing-2883.onrender.com/signup', { username, password });
      // Save a dummy token and username in localStorage
      localStorage.setItem('authToken', 'dummy_token');
      localStorage.setItem('username', username);
      // Navigate to the Home page with the success message from the backend
      navigate(`/home?message=${encodeURIComponent(response.data.message)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSignup}>
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
        <button type="submit" className="btn-submit">Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Signup;
