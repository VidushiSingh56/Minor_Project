import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');

    if (!authToken) {
      navigate('/login');
    } else {
      setUsername(storedUsername || 'User');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Hello, {username}! 🎉</h1>
      <p className="home-message">Welcome to the Home Page!</p>
      <img
        src="https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif"
        alt="Celebration"
        className="home-image"
      />
      <button onClick={handleLogout} className="btn-submit">Logout</button>
    </div>
  );
};

export default Home;
