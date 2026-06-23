import api from './api.js';

export const tripsService = {
  getDashboard: ()           => api.get('/trips/dashboard'),
  findAll:      (params)     => api.get('/trips', { params }),
  findOne:      (id)         => api.get(`/trips/${id}`),
  create:       (data)       => api.post('/trips', data),
  updateStatus: (id, data)   => api.patch(`/trips/${id}/status`, data),
};
