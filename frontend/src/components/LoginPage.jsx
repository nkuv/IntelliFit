// src/components/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api'; // Import API base URL

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE_URL}/api/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          window.location.href = '/dashboard'; // Redirect if token is valid
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous messages
    setSuccessMessage('');
    setIsLoading(true);

    if (!username || !password) {
      setErrorMessage('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard'; // Redirect after success
        }, 1000);
      } else {
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-container ${isLoading ? 'loading' : ''}`}>
      <div className="logo">
        <h1>IntelliFit</h1>
      </div>

      <div className="tagline">
        Welcome back to IntelliFit! 💪<br />
        Log in to access your AI-personalized workout plan and track your fitness progress.
      </div>

      {errorMessage && <div className="error-message" style={{ display: 'block' }}>{errorMessage}</div>}
      {successMessage && <div className="success-message" style={{ display: 'block' }}>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn" disabled={isLoading}>
          Login
        </button>
      </form>

      <div className="register-link">
        Don't have an account? <a href="/register">Sign up here</a>
      </div>
    </div>
  );
};

export default LoginPage;