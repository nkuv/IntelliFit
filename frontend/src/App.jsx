// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your new components
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

import AIWorkoutPlansPage from './components/AIWorkoutPlansPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* The wrapper div for LoginPage to ensure centering */}
        <Route
          path="/login"
          element={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              width: '100%',
            }}>
              <LoginPage />
            </div>
          }
        />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<div>Register Page (To be implemented)</div>} />

        {/* NEW FEATURE ROUTE: AI Workout Plans */}
        <Route path="/ai-workout-plans" element={<AIWorkoutPlansPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;