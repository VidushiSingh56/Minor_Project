// src/Home.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
  const message = 'Welcome to the Home Page!';

  // Check if user is authenticated
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      <p>{message}</p>
      <button onClick={handleLogout} className="btn-submit">Logout</button>
    </div>
  );
};

export default Home;
