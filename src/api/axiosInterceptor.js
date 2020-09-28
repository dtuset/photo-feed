import axios from 'axios';

axios.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('token');
  const auth = localStorage.getItem('auth');
  if (authToken) {
    config.headers.common = {
      Authorization: `Bearer ${authToken}`,
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    };
  }
  return config;
}, (err) => Promise.reject(err));
