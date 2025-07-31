import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const AIWorkoutPlansPage = () => {
  const [username, setUsername] = useState('User');
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [userGoals, setUserGoals] = useState({
    objective: '',
    frequency: ''
  });

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Navigate back to dashboard
  const navigateToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Handle goal form submission
  const handleGoalSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/workouts/generate-plan`,
        userGoals,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Set workoutPlans to response.data.weeklyPlan (array of days)
      setWorkoutPlans(response.data.weeklyPlan || []);
      console.log('Generated Plans:', response.data);
      setLoading(false);
      setShowGoalForm(false);
    } catch (error) {
      console.error('Error generating workout plans:', error);
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    navbar: {
      backgroundColor: '#6366f1',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    logoutBtn: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '2rem'
    },
    backBtn: {
      backgroundColor: '#e5e7eb',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      marginRight: '1rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    welcomeCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    generateBtn: {
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem'
    },
    goalForm: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: '#374151'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem'
    },
    checkboxGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    checkboxItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    submitBtn: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '2rem'
    },
    planCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    planHeader: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem',
      marginBottom: '1rem'
    },
    planName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    planMeta: {
      display: 'flex',
      gap: '1rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    exerciseList: {
      marginTop: '1rem'
    },
    exerciseItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid #f3f4f6'
    },
    startBtn: {
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '1rem',
      width: '100%'
    },
    loading: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.125rem',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>IntelliFit</div>
        <div style={styles.userInfo}>
          <span>Welcome, {username}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={navigateToDashboard}>
            ← Back to Dashboard
          </button>
          <h1 style={styles.title}>AI Workout Plans 🤖</h1>
        </div>

        {/* Welcome Section */}
        {!showGoalForm && workoutPlans.length === 0 && (
          <div style={styles.welcomeCard}>
            <h2>Get Your Personalized Workout Plan</h2>
            <p>
              Our advanced AI will create a custom workout plan tailored specifically to your fitness goals, 
              experience level, and preferences. Get started by telling us about your fitness objectives!
            </p>
            <button 
              style={styles.generateBtn}
              onClick={() => setShowGoalForm(true)}
            >
              Generate My Workout Plan
            </button>
          </div>
        )}

        {/* Goal Setting Form */}
        {showGoalForm && (
          <div style={styles.goalForm}>
            <h3>Tell Us About Your Fitness Goals</h3>
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Primary Fitness Goal</label>
                <select 
                  style={styles.select}
                  value={userGoals.objective}
                  onChange={(e) => setUserGoals({...userGoals, objective: e.target.value})}
                  required
                >
                  <option value="">Select your goal</option>
                  <option value="lose-weight">Lose Weight</option>
                  <option value="build-muscle">Build Muscle</option>
                  <option value="improve-endurance">Improve Endurance</option>
                  <option value="general-fitness">General Fitness</option>
                  <option value="strength-training">Strength Training</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Workout Frequency</label>
                <select 
                  style={styles.select}
                  value={userGoals.frequency}
                  onChange={(e) => setUserGoals({...userGoals, frequency: e.target.value})}
                  required
                >
                  <option value="">How often do you want to work out?</option>
                  <option value="3">3 days per week</option>
                  <option value="4">4 days per week</option>
                  <option value="5">5 days per week</option>
                  <option value="6">6 days per week</option>
                </select>
              </div>

              <button type="button" style={styles.submitBtn} disabled={loading} onClick={handleGoalSubmission}>
                {loading ? 'Generating Your Plan...' : 'Generate Workout Plan'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={styles.loading}>
            <div>🤖 AI is creating your personalized workout plan...</div>
            <div style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>This may take a few seconds</div>
          </div>
        )}

        {/* Generated Workout Plans */}
        {workoutPlans.length > 0 && !loading && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2>Your Personalized Workout Plan</h2>
              <button 
                style={styles.generateBtn}
                onClick={() => {
                  setWorkoutPlans([]);
                  setShowGoalForm(true);
                }}
              >
                Generate New Plan
              </button>
            </div>
            
            <div style={styles.plansGrid}>
              {workoutPlans.map((plan, idx) => (
                <div key={idx} style={styles.planCard}>
                  <div style={styles.planHeader}>
                    <h3 style={styles.planName}>{plan.day}</h3>
                    <div style={styles.planMeta}>
                      <span>{plan.focus}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{marginBottom: '1rem', color: '#374151'}}>Exercises:</h4>
                    <div style={styles.exerciseList}>
                      {plan.exercises.map((exercise, i) => (
                        <div key={i} style={styles.exerciseItem}>
                          <span>{exercise.name}</span>
                          <span style={{color: '#6b7280'}}>
                            {exercise.sets 
                              ? `${exercise.sets} sets × ${exercise.reps}` 
                              : `${exercise.duration_seconds} sec`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button style={styles.startBtn}>
                    Start This Day
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWorkoutPlansPage;