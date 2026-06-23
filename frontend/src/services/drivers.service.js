import api from './api.js';

export const driversService = {
  findAll:   ()         => api.get('/drivers'),
  findOne:   (id)       => api.get(`/drivers/${id}`),
  create:    (data)     => api.post('/drivers', data),
  update:    (id, data) => api.patch(`/drivers/${id}`, data),
  remove:    (id)       => api.delete(`/drivers/${id}`),
  getReport: (id, month, year) =>
    api.get(`/drivers/${id}/report`, { params: { month, year } }),
};
