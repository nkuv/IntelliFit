// src/components/LandingPage.jsx
import React, { useEffect } from 'react';

const LandingPage = () => {
  useEffect(() => {
    // Use setTimeout for redirection to allow the "Redirecting..." message to show briefly
    const redirectTimer = setTimeout(() => {
      window.location.href = '/login'; // Use a relative path or React Router path
    }, 1000);

    // Cleanup the timer if the component unmounts before redirection
    return () => clearTimeout(redirectTimer);
  }, []); // Run once on component mount

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center',
    }}>
      <div>
        <div style={{
          fontSize: '3em',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}>IntelliFit</div>
        <div style={{
          fontSize: '1.2em',
        }}>Redirecting to login...</div>
      </div>
    </div>
  );
};

export default LandingPage;