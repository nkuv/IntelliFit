// src/utils/api.js
export const API_BASE_URL = 'http://127.0.0.1:5001';

// Optional: A helper for authenticated fetches
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const response = await fetch(url, { ...options, headers });
  return response;
};