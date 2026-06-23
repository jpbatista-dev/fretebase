import api from './api.js';

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};
