import api from './api.js';

export const routesService = {
  findAll: () => api.get('/routes'),
};
